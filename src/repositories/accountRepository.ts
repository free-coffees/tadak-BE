const db = require('../../database/index');
const account = db.account;

async function createAccount(account_name: string, user_id: number) {
   await account.create({
      account_name: account_name,
      user_id: user_id,
   });
}

module.exports = { createAccount };
