import { createExchangeDTO } from '../dto/exchangeDTO';
import ApiError from '../errorCuston/apiError';

const db = require('../../database/index');
const exchangeRepo = require('../repositories/exchangeRepository');
const balanceRepo = require('../repositories/balanceRepository');

async function createExchangeService(createExchangeDTO: createExchangeDTO) {
   const transaction = await db.sequelize.transaction();
   try {
      const { accountId, exchangeDate, fromCurrency, toCurrency, exchangeRate, amount } = createExchangeDTO;
      if (fromCurrency == toCurrency) {
         throw new ApiError(400, 'fromCurrency, toCurrency 값이 달라야합니다.');
      }
      const balanceKRW = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, 'krw');
      const balanceUSD = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, 'usd');
      let exchangedAmount = 0;
      let updatedBalanceKRW: number = Number(balanceKRW.amount);
      let updatedBalanceUSD: number = Number(balanceUSD.amount);
      if (fromCurrency == 'krw') {
         // krw => usd
         exchangedAmount = amount / exchangeRate;
         exchangedAmount = Number(exchangedAmount.toFixed(2)); // usd 는 소수 셋째자리에서 반올림
         updatedBalanceKRW -= amount;
         updatedBalanceUSD += exchangedAmount;
      } else {
         // use => krw
         exchangedAmount = Math.floor(amount * exchangeRate); // krw 는 소수점 미만 내림
         updatedBalanceKRW += exchangedAmount;
         updatedBalanceUSD -= amount;
      }
      await exchangeRepo.createExchange(createExchangeDTO, exchangedAmount, { transaction });
      await balanceRepo.updateBalance(accountId, 'krw', updatedBalanceKRW, { transaction });
      await balanceRepo.updateBalance(accountId, 'usd', updatedBalanceUSD, { transaction });
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.log('Transaction failed:', error);
      throw new ApiError(500, '트랜잭션 처리 중 오류가 발생했습니다.');
   }
}

module.exports = { createExchangeService };
