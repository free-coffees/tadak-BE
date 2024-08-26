import { Transaction } from 'sequelize';
import { createTransactionDTO } from '../dto/transactionDTO';
import ApiError from '../errorCuston/apiError';

const db = require('../../database/index');
const transactionRepo = require('../repositories/transactionRepository');
const balanceRepo = require('../repositories/balanceRepository');
const holdingRepo = require('../repositories/holdingRepository');

async function createTransactionService(createTransactionDTO: createTransactionDTO) {
   const transaction = await db.sequelize.transaction();
   try {
      const { accountId, stockId, transactionDate, transactionType, quantity, price, currency } = createTransactionDTO;
      const balance = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, currency);
      let holding = await holdingRepo.readHoldingByAccountIdAndStockId(accountId, stockId);
      let updatedQuantity;
      let updatedAvgPrice;
      let updatedBalance;
      if (!holding) {
         // 보유주식 없으면 하나 생성
         holding = await holdingRepo.createHolding(accountId, stockId, { transaction });
      }

      // 매수,매도 시 잔고 및 보유량 업데이트를 위한 계산
      if (transactionType == 'buy') {
         // 매수
         updatedBalance = Number(balance.amount) - quantity * price;
         updatedQuantity = holding.quantity + quantity;
         updatedAvgPrice = (holding.quantity * Number(holding.average_price) + quantity * price) / updatedQuantity;
      } else {
         //매도
         updatedBalance = Number(balance.amount) + quantity * price;
         updatedQuantity = holding.quantity - quantity;
         updatedAvgPrice = Number(holding.average_price);
      }
      await transactionRepo.createTransaction(createTransactionDTO, { transaction });
      await balanceRepo.updateBalance(accountId, currency, updatedBalance, { transaction });
      if (updatedQuantity == 0) {
         await holdingRepo.deleteHolding(accountId, stockId, { transaction });
      } else {
         await holdingRepo.updateHolding(accountId, stockId, updatedQuantity, updatedAvgPrice, { transaction });
      }
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.log('Transaction failed:', error);
      throw new ApiError(500, '트랜잭션 처리 중 오류가 발생했습니다.');
   }
}

module.exports = { createTransactionService };
