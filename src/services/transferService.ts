import { Transaction } from 'sequelize';
import { CreateTransferDTO, UpdateTransferDTO } from '../dto/transferDTO';
import ApiError from '../errorCustom/apiError';

const db = require('../../database/index');
const transferRepo = require('../repositories/transferRepository');
const balanceRepo = require('../repositories/balanceRepository');
const accountRepo = require('../repositories/accountRepository');

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
   const { accountId, transferId, transferDate, amount, transferName } = updateTransferDTO;
   const transfer = await transferRepo.readTransferById(transferId);
   if (!transfer) {
      throw new ApiError(404, '존재하지 않는 입출금 내역 입니다.');
   }
   const currency = transfer.currency;
   const transferType = transfer.transfer_type;
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      const balance = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, currency);
      const diffAmount = amount - Number(transfer.amount);
      let updatedBalance = Number(balance.amount);
      if (transferType == 'deposit') {
         updatedBalance += diffAmount;
      } else {
         updatedBalance -= diffAmount;
      }
      await transferRepo.updateTransfer(transferId, transferDate, amount, transferName, { transaction });
      await balanceRepo.updateBalance(accountId, currency, updatedBalance, { transaction });
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed at updateTransfer:', error);
      throw new ApiError(500, '입출금 거래 내역 수정 중 오류가 발생했습니다.');
   }
}

async function deleteTransferService(userId: number, transferId: number) {
   const transfer = await transferRepo.readTransferById(transferId);
   if (!transfer) {
      throw new ApiError(404, '존재하지 않는 입출금 내역 입니다.');
   }
   const account = await accountRepo.readAccountById(transfer.account_id);
   if (account.user_id != userId) {
      throw new ApiError(403, '이 거래 내역에 대한 권한이 없습니다.');
   }
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      const accountId = account.id;
      const currency = transfer.currency;
      const balance = await balanceRepo.readBalanceByAccountIdAndCurrency(accountId, currency);
      let updatedBalance = Number(balance.amount);
      if (transfer.transfer_type == 'deposit') {
         updatedBalance -= Number(transfer.amount);
      } else {
         updatedBalance += Number(transfer.amount);
      }
      // 입출금내역 삭제, 잔고 업데이트
      await transferRepo.deleteTransfer(transferId, { transaction });
      await balanceRepo.updateBalance(accountId, currency, updatedBalance, { transaction });
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      console.error('Transaction failed at updateTransfer:', error);
      throw new ApiError(500, '입출금 거래 내역 삭제 중 오류가 발생했습니다.');
   }
}

module.exports = { createTransferService, updateTransferService, deleteTransferService };
