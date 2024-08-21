import ApiError from '../errorCuston/apiError';

const db = require('../../database/index');
const accountRepo = require('../repositories/accountRepository');
const balanceRepo = require('../repositories/balanceRepository');

async function createAccountService(account_name: string, user_id: number) {
   const transaction = await db.sequelize.transaction();
   try {
      const account = await accountRepo.createAccount(account_name, user_id, transaction);
      await balanceRepo.createBalance(account.id, 'KRW', transaction);
      await balanceRepo.createBalance(account.id, 'USD', transaction);
      await transaction.commit();
      return account;
   } catch (error) {
      await transaction.rollback();
      throw error;
   }
}

module.exports = { createAccountService };
