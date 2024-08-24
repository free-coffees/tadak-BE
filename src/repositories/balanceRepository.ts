import { Transaction } from 'sequelize';
import { createTransferDTO } from '../dto/transferDTO';

const db = require('../../database/index');
const balance = db.balance;

async function createBalance(accountId: number, currency: string, transaction: Transaction) {
   const data = await balance.create(
      {
         account_id: accountId,
         currency: currency,
         amount: 0,
      },
      {
         transaction,
      },
   );
   return data;
}

async function updateBalanceByTransfer(createTransferDTO: createTransferDTO, transaction: Transaction) {
   const { accountId, transferType, amount, currency } = createTransferDTO;
   const data = await balance.findOne(
      { where: { account_id: accountId, currency: currency }, raw: true },
      { transaction },
   );
   let sum = Number(data.amount);

   if (transferType == 'deposit') {
      sum += amount;
   } else {
      sum -= amount;
   }
   await balance.update(
      {
         amount: sum,
      },
      {
         where: {
            account_id: accountId,
            currency: currency,
         },
      },
      {
         transaction,
      },
   );
}

module.exports = { createBalance, updateBalanceByTransfer };
