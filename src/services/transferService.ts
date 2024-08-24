import { Transaction } from 'sequelize';
import { createTransferDTO } from '../dto/transferDTO';
import ApiError from '../errorCuston/apiError';

const db = require('../../database/index');
const transferRepo = require('../repositories/transferRepository');
const balanceRepo = require('../repositories/balanceRepository');

async function createTransferService(createTransferDTO: createTransferDTO) {
   const transaction: Transaction = await db.sequelize.transaction();
   try {
      await transferRepo.createTransfer(createTransferDTO, transaction);
      await balanceRepo.updateBalanceByTransfer(createTransferDTO, transaction); // find해서 그 금액에서 입금 출금 여부에 따라 플러스마이너스 후 업데이트
      await transaction.commit();
   } catch (error) {
      await transaction.rollback();
      throw error;
   }
}

module.exports = { createTransferService };
