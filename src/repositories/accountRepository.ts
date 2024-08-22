const db = require('../../database/index');
const account = db.account;

async function createAccount(accountName: string, userId: number) {
   const data = await account.create({
      account_name: accountName,
      user_id: userId,
   });
   return data;
}

module.exports = { createAccount };
