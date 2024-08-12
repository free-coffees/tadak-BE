const accountRepo = require('../repositories/accountRepository');

async function createAccountService(account_name: string, user_id: number) {
   await accountRepo.createAccount(account_name, user_id);
}

module.exports = { createAccountService };
