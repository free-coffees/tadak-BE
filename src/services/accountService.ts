import { Transaction } from 'sequelize';
import ApiError from '../errorCuston/apiError';

const redisClient = require('../../database/redis');
const db = require('../../database/index');
const accountRepo = require('../repositories/accountRepository');
const balanceRepo = require('../repositories/balanceRepository');
const holdingRepo = require('../repositories/holdingRepository');
const stockRepo = require('../repositories/stockRepository');
const addRedisPrice = require('../utils/addRedisPrice');

async function createAccountService(accountName: string, userId: number) {
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      const account = await accountRepo.createAccount(accountName, userId, transaction);
      await balanceRepo.createBalance(account.id, 'KRW', transaction);
      await balanceRepo.createBalance(account.id, 'USD', transaction);
      await transaction.commit();
      return account;
   } catch (error) {
      await transaction.rollback();
      throw error;
   }
}

async function getAccountListService(userId: number) {
   const accounts = await accountRepo.readAccountByUserId(userId);
   let exchangeRate = await redisClient.get('exchange_rate');

   if (!exchangeRate) {
      exchangeRate = await exchangeRate.readRecentExchangeRate();
   }

   exchangeRate = parseFloat(exchangeRate);

   const redisStockPrices = await redisClient.hGetAll('stock_prices');
   const accountList = [];
   let myBalance = 0;

   for (const account of accounts) {
      const accountId = account.id;
      const balances = await balanceRepo.readBalanceByAccountId(accountId);
      const holdings = await holdingRepo.readHoldingByAccountId(accountId);

      let totalBalance = 0;

      balances.forEach((balance: any) => {
         const amount = parseFloat(balance.amount);
         if (balance.currency == 'usd') {
            totalBalance += amount * exchangeRate;
         } else {
            totalBalance += amount;
         }
      });

      for (const holding of holdings) {
         const stock = await stockRepo.readStockById(holding.stock_id);
         let stockPrice = redisStockPrices[stock.stock_code];

         if (!stockPrice) {
            stockPrice = await addRedisPrice(stock.stock_code);
         }

         stockPrice = parseFloat(stockPrice);
         const quantity = parseFloat(holding.quantity);

         if (stock.market == 'NYSE' || stock.market == 'NASDAQ' || stock.market == 'AMEX') {
            totalBalance += quantity * stockPrice * exchangeRate;
         } else {
            totalBalance += quantity * stockPrice;
         }
      }

      totalBalance = Math.trunc(totalBalance);

      myBalance += totalBalance;

      accountList.push({ accountId: accountId, accountName: account.account_name, totalBalance: totalBalance });
   }

   accountList.unshift({ accountId: null, accountName: '내 자산', totalBalance: myBalance });

   return accountList;
}

module.exports = { createAccountService, getAccountListService };
