import { NextFunction, Request, Response } from 'express';
import ApiError from '../errorCuston/apiError';

const accountRepo = require('../repositories/accountRepository');

async function accountAccess(req: Request, res: Response, next: NextFunction) {
   // transfer, exchange, dividend, transaction
   try {
      const userId = req.userId;
      const accountId = req.body.accountId;
      const account = await accountRepo.readAccountById(accountId);
      if (!account) {
         const error = new ApiError(404, '존재하지 않는 계좌입니다.');
         throw error;
      }
      if (account.user_id != userId) {
         const error = new ApiError(403, '이 계좌에 대한 권한이 없습니다.');
         throw error;
      }
      next();
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = accountAccess;
