import { Transaction } from 'sequelize';
import { CreateTransferDTO } from '../dto/transferDTO';

const db = require('../../database/index');
const transfer = db.transfer;

async function createTransfer(createTransferDTO: CreateTransferDTO, option?: { transaction?: Transaction }) {
   const { accountId, transferDate, transferType, amount, currency } = createTransferDTO;
   const { transaction } = option || {};
   const data = await transfer.create(
      {
         account_id: accountId,
         transfer_date: transferDate,
         transfer_type: transferType,
         amount: amount,
         currency: currency,
      },
      {
         transaction,
      },
   );
   return data;
}

module.exports = { createTransfer };
