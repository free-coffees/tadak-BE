import { Transaction } from 'sequelize';
import { CreateTransferDTO } from '../dto/transferDTO';

const db = require('../../database/index');
const transfer = db.transfer;

async function createTransfer(createTransferDTO: CreateTransferDTO, option?: { transaction?: Transaction }) {
   const { accountId, transferDate, transferType, amount, currency, transferName } = createTransferDTO;
   const { transaction } = option || {};
   const data = await transfer.create(
      {
         account_id: accountId,
         transfer_date: transferDate,
         transfer_type: transferType,
         amount: amount,
         currency: currency,
         transfer_name: transferName,
      },
      {
         transaction,
      },
   );
   return data;
}

async function readTransferById(transferId: number) {
   const data = await transfer.findOne({ where: { id: transferId }, raw: true });
   return data;
}

async function updateTransfer(
   transferId: number,
   transferDate: Date,
   amount: number,
   transferName: string,
   option?: { transaction?: Transaction },
) {
   const { transaction } = option || {};
   const data = await transfer.update(
      {
         transfer_date: transferDate,
         amount: amount,
         transfer_name: transferName,
      },
      {
         where: {
            id: transferId,
         },
         transaction,
      },
   );
   return data;
}

async function deleteTransfer(transferId: number, option?: { transaction?: Transaction }) {
   const { transaction } = option || {};
   await transfer.destroy({ where: { id: transferId }, transaction });
}

module.exports = { createTransfer, readTransferById, updateTransfer, deleteTransfer };
