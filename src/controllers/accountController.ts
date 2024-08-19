import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/api.error';

const accountService = require('../services/accountService');

async function createAccountController(req: Request, res: Response) {
   try {
      const user_id = req.userId;
      const { account_name } = req.body;
      if (!account_name || account_name == '') {
         const error = new ApiError(400, 'Invalid Request');
         throw error;
      }
      await accountService.createAccountService(account_name, user_id);
      return res.status(StatusCodes.OK).send({ message: '계좌가 성공적으로 생성되었습니다.' });
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { createAccountController };
