const db = require('../../database/index');
const account = db.account;

async function createAccount(account_name: string, user_id: number) {
   const data = await account.create({
      account_name: account_name,
      user_id: user_id,
      raw: true,
   });
   return data;
}

module.exports = { createAccount };
