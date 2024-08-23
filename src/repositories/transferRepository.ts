import { Transaction } from 'sequelize';
import { createTransferDTO } from '../dto/transferDTO';

const db = require('../../database/index');
const transfer = db.transfer;

async function createTransfer(createTransferDTO: createTransferDTO, transaction: Transaction) {
   const { accountId, transferDate, transferType, amount } = createTransferDTO;

   const data = await transfer.create(
      {
         account_id: accountId,
         transfer_date: transferDate,
         transfer_type: transferType,
         amount: amount,
      },
      {
         transaction,
      },
   );
   return data;
}

module.exports = { createTransfer };
