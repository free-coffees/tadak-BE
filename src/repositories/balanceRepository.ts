const db = require('../../database/index');
const balance = db.balance;

async function createBalance(account_id: number, currency: string, transaction: any) {
   const data = await balance.create(
      {
         account_id: account_id,
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
