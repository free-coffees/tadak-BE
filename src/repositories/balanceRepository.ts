import { Transaction } from 'sequelize';

const db = require('../../database/index');
const balance = db.balance;

async function createBalance(accountId: number, currency: string, option?: { transaction?: Transaction }) {
   const { transaction } = option || {};
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

async function readBalanceByAccountIdAndCurrency(accountId: number, currency: string) {
   const data = await balance.findOne({
      where: {
         account_id: accountId,
         currency: currency,
      },
      raw: true,
   });
   return data;
}

async function readBalanceByAccountId(accountId: number) {
   const data = await balance.findAll({
      where: {
         account_id: accountId,
      },
      raw: true,
   });
   return data;
}

async function updateBalance(
   accountId: number,
   currency: string,
   amount: number,
   option?: { transaction?: Transaction },
) {
   const { transaction } = option || {};
   const data = await balance.update(
      {
         amount: amount,
      },
      {
         where: {
            account_id: accountId,
            currency: currency,
         },
         transaction,
      },
   );
   return data;
}

module.exports = { createBalance, readBalanceByAccountIdAndCurrency, readBalanceByAccountId, updateBalance };
