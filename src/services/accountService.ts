import { Transaction } from 'sequelize';
import ApiError from '../errorCustom/apiError';
import { Holding, UpdateAccountDTO } from '../dto/accountDTO';

const redisClient = require('../../database/redis');
const db = require('../../database/index');
const accountRepo = require('../repositories/accountRepository');
const balanceRepo = require('../repositories/balanceRepository');
const holdingRepo = require('../repositories/holdingRepository');
const stockRepo = require('../repositories/stockRepository');
const securitiesCompanyRepo = require('../repositories/securitiesCompanyRepository');
const addRedisPrice = require('../utils/addRedisPrice');

async function createAccountService(userId: number, accountName: string, securitiesCompanyId: number) {
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      const account = await accountRepo.createAccount(userId, accountName, securitiesCompanyId, transaction);
      await balanceRepo.createBalance(account.id, 'KRW', transaction);
      await balanceRepo.createBalance(account.id, 'USD', transaction);
      await transaction.commit();
      return account;
   } catch (error) {
      await transaction.rollback();
      throw new ApiError(500, '트랜잭션 처리 중 오류가 발생했습니다.');
   }
}

async function createAccountInitialDataService(
   accountId: number,
   balanceKRW: number,
   balanceUSD: number,
   holdings: Holding[],
) {
   console.log(holdings);
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
   let myAsset = 0;

   for (const account of accounts) {
      const accountId = account.id;
      const balances = await balanceRepo.readBalanceByAccountId(accountId);
      const holdings = await holdingRepo.readHoldingByAccountId(accountId);
      const securitiesCompany = await securitiesCompanyRepo.readSecuritiesCompanyById(account.securities_company_id);
      const logoUrl = securitiesCompany.logo_image_url;

      let totalAsset = 0;

      balances.forEach((balance: any) => {
         const amount = parseFloat(balance.amount);
         if (balance.currency == 'usd') {
            totalAsset += amount * exchangeRate;
         } else {
            totalAsset += amount;
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
            totalAsset += quantity * stockPrice * exchangeRate;
         } else {
            totalAsset += quantity * stockPrice;
         }
      }

      totalAsset = Math.trunc(totalAsset);

      myAsset += totalAsset;

      accountList.push({
         accountId: accountId,
         accountName: account.account_name,
         totalAsset: totalAsset,
         logoUrl: logoUrl,
      });
   }

   accountList.unshift({ accountId: null, accountName: '내 자산', totalAsset: myAsset, logoUrl: null });

   return accountList;
}

async function updateAccountService(accountId: number, accountName?: string, securitiesCompanyId?: number) {
   const updateAccountDTO: UpdateAccountDTO = {};

   if (accountName) {
      updateAccountDTO.account_name = accountName;
   }

   if (securitiesCompanyId) {
      updateAccountDTO.securities_company_id = securitiesCompanyId;
   }

   await accountRepo.updateAccount(accountId, updateAccountDTO);
}

async function deleteAccountService(accountId: number) {
   const transaction = await db.sequelize.transaction();
   try {
      await accountRepo.deleteAccount(accountId, transaction);
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      throw new ApiError(500, '트랜잭션 처리 중 오류가 발생했습니다.');
   }
}

module.exports = {
   createAccountService,
   createAccountInitialDataService,
   getAccountListService,
   updateAccountService,
   deleteAccountService,
};
