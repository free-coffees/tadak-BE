import { Transaction } from 'sequelize';
import { CreateTransactionDTO } from '../dto/transactionDTO';

const db = require('../../database/index');
const trans = db.transaction;

async function createTransaction(createTransactionDTO: CreateTransactionDTO, option?: { transaction?: Transaction }) {
   const { transaction } = option || {};
   const { accountId, stockId, transactionDate, transactionType, quantity, price, currency } = createTransactionDTO;
   const totalAmount = quantity * price;
   const data = await trans.create(
      {
         account_id: accountId,
         stock_id: stockId,
         transaction_date: transactionDate,
         transaction_type: transactionType,
         quantity: quantity,
         price: price,
         currency: currency,
         total_amount: totalAmount,
      },
      { transaction },
   );
   return data;
}

module.exports = { createTransaction };
