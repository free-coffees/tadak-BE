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
   const exchangeRate = await redisClient.get('exchange_rate');
   const redisStockPrices = await redisClient.hGetAll('stock_prices');
   const accountList = [];
   for (const account of accounts) {
      const accountId = account.id;
      const balances = await balanceRepo.readBalanceByAccountId(accountId);
      const holdings = await holdingRepo.readHoldingByAccountId(accountId);

      let totalBalance = 0;

      balances.forEach((balance: any) => {
         if (balance.currency == 'usd') {
            totalBalance += parseFloat(balance.amount) * parseFloat(exchangeRate);
         } else {
            totalBalance += parseFloat(balance.amount);
         }
      });

      for (const holding of holdings) {
         const stock = await stockRepo.readStockById(holding.stock_id);
         let stockPrice = redisStockPrices[stock.stock_code];
         if (!stockPrice) {
            stockPrice = await addRedisPrice(stock.stock_code);
         }
         stockPrice = parseFloat(stockPrice);
         if (stock.market == 'NYSE' || stock.market == 'NASDAQ' || stock.market == 'AMEX') {
            totalBalance += parseFloat(holding.quantity) * stockPrice * parseFloat(exchangeRate);
         } else {
            totalBalance += parseFloat(holding.quantity) * stockPrice;
         }
      }

      totalBalance = Math.trunc(totalBalance);

      accountList.push({ accountId: accountId, accountName: account.account_name, totalBalance: totalBalance });
   }
   return accountList;
}

// const redis = require('redis');
// const client = redis.createClient();

// async function getAccountTotalValue(accountId, sequelize) {
//    // Redis에서 환율과 주식 가격 조회
//    const exchangeRate = await client.getAsync('exchangeRate:usdToKrw');
//    const stockPrices = await getStockPricesFromRedis(client); // 주식 현재가

//    // DB에서 잔액 조회
//    const balances = await sequelize.models.balance.findAll({
//       where: { account_id: accountId },
//    });

//    // DB에서 보유 주식 조회
//    const holdings = await sequelize.models.holding.findAll({
//       where: { account_id: accountId, status: 'active' },
//    });

//    let totalBalance = 0;

//    // 잔액 합산 (USD는 환율 적용)
//    balances.forEach((balance) => {
//       if (balance.currency === 'usd') {
//          totalBalance += parseFloat(balance.amount) * parseFloat(exchangeRate);
//       } else {
//          totalBalance += parseFloat(balance.amount);
//       }
//    });

//    // 보유 주식 가치 합산
//    holdings.forEach((holding) => {
//       const currentStockPrice = stockPrices[holding.stock_id];
//       const stockValue = currentStockPrice * holding.quantity;
//       totalBalance += stockValue; // 필요한 경우 환율 적용
//    });

//    return totalBalance;
// }

// async function getStockPricesFromRedis(client) {
//    const keys = await client.keysAsync('stockPrice:*');
//    const prices = {};
//    for (const key of keys) {
//       const stockId = key.split(':')[1];
//       prices[stockId] = await client.getAsync(key);
//    }
//    return prices;
// }

module.exports = { createAccountService, getAccountListService };
