import { Transaction } from 'sequelize';
import ApiError from '../errorCustom/apiError';
import { Holding, UpdateAccountDTO } from '../dto/accountDTO';
import { CreateTransferDTO } from '../dto/transferDTO';
import { CreateTransactionDTO } from '../dto/transactionDTO';

const redisClient = require('../../database/redis');
const db = require('../../database/index');
const accountRepo = require('../repositories/accountRepository');
const balanceRepo = require('../repositories/balanceRepository');
const holdingRepo = require('../repositories/holdingRepository');
const stockRepo = require('../repositories/stockRepository');
const securitiesCompanyRepo = require('../repositories/securitiesCompanyRepository');
const transferRepo = require('../repositories/transferRepository');
const transactionRepo = require('../repositories/transactionRepository');
const addRedisPrice = require('../utils/addRedisPrice');

async function createAccountService(userId: number, accountName: string, securitiesCompanyId: number) {
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      const account = await accountRepo.createAccount(userId, accountName, securitiesCompanyId, { transaction });
      await balanceRepo.createBalance(account.id, 'KRW', { transaction });
      await balanceRepo.createBalance(account.id, 'USD', { transaction });
      await transaction.commit();
      return account;
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed at createAccount:', error);
      throw new ApiError(500, '계좌를 생성하던 중 오류가 발생했습니다.');
   }
}

async function createAccountInitialDataService(
   accountId: number,
   balanceKRW: number,
   balanceUSD: number,
   holdings: Holding[],
) {
   const account = await accountRepo.readAccountById(accountId);
   if (account.is_started == 'Y') {
      throw new ApiError(400, '이미 기존 입력 내역이 있는 계좌입니다.');
   }
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      // 0. 날짜는 현재날짜기준
      const now = new Date();
      let createTransferDTO: CreateTransferDTO;

      // 1. krw 입금
      if (balanceKRW != 0) {
         createTransferDTO = {
            accountId,
            transferDate: now,
            transferType: 'deposit',
            amount: balanceKRW,
            currency: 'krw',
            transferName: '기존 내역 기록',
         };
         await transferRepo.createTransfer(createTransferDTO, { transaction });
         await balanceRepo.updateBalance(accountId, 'krw', balanceKRW, { transaction });
      }

      // 2. usd 입금
      if (balanceUSD != 0) {
         createTransferDTO = {
            accountId,
            transferDate: now,
            transferType: 'deposit',
            amount: balanceUSD,
            currency: 'usd',
            transferName: '기존 내역 기록',
         };
         await transferRepo.createTransfer(createTransferDTO, { transaction });
         await balanceRepo.updateBalance(accountId, 'usd', balanceUSD, { transaction });
      }

      // 3. holdings 에 맞춰서 입금 후 매수(잔고는 업데이트 할 필요x)
      for (const holding of holdings) {
         // 1).입금
         const amount = holding.quantity * holding.averagePrice;
         createTransferDTO = {
            accountId,
            transferDate: now,
            transferType: 'deposit',
            amount: amount,
            currency: holding.currency,
            transferName: '기존 내역 기록',
         };
         await transferRepo.createTransfer(createTransferDTO, { transaction });

         // 2). 매수
         const createTransactionDTO: CreateTransactionDTO = {
            accountId,
            stockId: holding.stockId,
            transactionDate: now,
            transactionType: 'buy',
            quantity: holding.quantity,
            price: holding.averagePrice,
            currency: holding.currency,
         };
         const stock = await stockRepo.readStockById(holding.stockId);
         let curHolding = await holdingRepo.readHoldingByAccountIdAndStockId(accountId, holding.stockId);
         if (!curHolding) {
            curHolding = await holdingRepo.createHolding(accountId, holding.stockId, { transaction });
            await addRedisPrice(stock.stock_code); // redis stock_prices 에 추가
         }
         let updatedQuantity = Number(curHolding.quantity) + holding.quantity;
         let updatedAvgPrice =
            (Number(curHolding.quantity) * Number(curHolding.average_price) + holding.quantity * holding.averagePrice) /
            updatedQuantity;
         await transactionRepo.createTransaction(createTransactionDTO, { transaction });
         await holdingRepo.updateHolding(accountId, holding.stockId, updatedQuantity, updatedAvgPrice, undefined, {
            transaction,
         });
      }
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed at createAccountInitialData:', error);
      throw new ApiError(500, '한번에 입력하기 중 오류가 발생했습니다.');
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
      await accountRepo.deleteAccount(accountId, { transaction });
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed at deleteAccount:', error);
      throw new ApiError(500, '계좌를 삭제하던 중 오류가 발생했습니다.');
   }
}

module.exports = {
   createAccountService,
   createAccountInitialDataService,
   getAccountListService,
   updateAccountService,
   deleteAccountService,
};
