import { Transaction } from 'sequelize';
import { CreateTransferDTO, UpdateTransferDTO } from '../dto/transferDTO';
import ApiError from '../errorCustom/apiError';

const db = require('../../database/index');
const transferRepo = require('../repositories/transferRepository');
const balanceRepo = require('../repositories/balanceRepository');

async function createTransferService(createTransferDTO: CreateTransferDTO) {
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      const { accountId, transferType, amount, currency } = createTransferDTO;
      const balance = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, currency);
      let updatedBalance = Number(balance.amount);
      // 입출금에 따른 잔고 계산
      if (transferType == 'deposit') {
         updatedBalance += amount;
      } else {
         updatedBalance -= amount;
      }

      await transferRepo.createTransfer(createTransferDTO, { transaction }); // 입출금 내역 생성
      await balanceRepo.updateBalance(accountId, currency, updatedBalance, { transaction }); // 계좌잔고 업데이트
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed at createTransfer:', error);
      throw new ApiError(500, '입출금 거래 입력 중 오류가 발생했습니다.');
   }
}

async function updateTransferService(updateTransferDTO: UpdateTransferDTO) {
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      const { accountId, transferId, transferDate, transferType, amount, currency, transferName } = updateTransferDTO;
      await transferRepo.updateTransfer(transferId, transferDate, amount, transferName, { transaction }); // 메모추가해야함
      const transfer = await transferRepo.readTransferById(transferId);
      const balance = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, currency);
      const diffAmount = amount - transfer.amount;
      let updatedBalance = Number(balance.amount);
      if (transferType == 'deposit') {
         updatedBalance += diffAmount;
      } else {
         updatedBalance -= diffAmount;
      }
      await balanceRepo.updateBalance(accountId, currency, updatedBalance, { transaction });
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed at updateTransfer:', error);
      throw new ApiError(500, '입출금 거래 내역 수정 중 오류가 발생했습니다.');
   }
}

module.exports = { createTransferService, updateTransferService };
