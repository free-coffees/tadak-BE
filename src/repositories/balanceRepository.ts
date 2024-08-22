const db = require('../../database/index');
const balance = db.balance;

async function createBalance(accountId: number, currency: string, transaction: any) {
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

module.exports = { createBalance };
