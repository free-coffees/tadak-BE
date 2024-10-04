import { CreateTransactionDTO } from '../dto/transactionDTO';
import ApiError from '../errorCustom/apiError';

const db = require('../../database/index');
const transactionRepo = require('../repositories/transactionRepository');
const balanceRepo = require('../repositories/balanceRepository');
const holdingRepo = require('../repositories/holdingRepository');
const stockRepo = require('../repositories/stockRepository');
const addRedisPrice = require('../utils/addRedisPrice');

async function createTransactionService(createTransactionDTO: CreateTransactionDTO) {
   const transaction = await db.sequelize.transaction();
   const { accountId, stockId, transactionDate, transactionType, quantity, price, currency } = createTransactionDTO;
   const balance = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, currency);
   let holding = await holdingRepo.readHoldingByAccountIdAndStockId(accountId, stockId);
   if (holding && holding.status == 'inactive') {
      throw new ApiError(400, '보유한 주식이 비활성된 상태입니다. 거래내역을 수정해주세요.');
   }
   try {
      let updatedQuantity;
      let updatedAvgPrice;
      let updatedBalance;
      let stock = await stockRepo.readStockById(stockId);
      if (!holding) {
         // 보유주식 없으면 하나 생성
         holding = await holdingRepo.createHolding(accountId, stockId, { transaction });
         //redis 에 등록
         await addRedisPrice(stock.stock_code);
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
      } else if (updatedQuantity < 0) {
         await holdingRepo.updateHolding(accountId, stockId, updatedQuantity, updatedAvgPrice, 'inactive', {
            transaction,
         });
      } else {
         await holdingRepo.updateHolding(accountId, stockId, updatedQuantity, updatedAvgPrice, undefined, {
            transaction,
         });
      }
      await transaction.commit();
      if (updatedQuantity < 0) {
         return 'inactive';
      } else {
         return 'active';
      }
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed:', error);
      throw new ApiError(500, '트랜잭션 처리 중 오류가 발생했습니다.');
   }
}

module.exports = { createTransactionService };
