import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';

const transferService = require('../services/transferService');

async function createTransferController(req: Request, res: Response) {
   try {
      const userId = req.userId;
      const transferInfo = req.body;
      //   if (!account_name || account_name == '') {
      //      const error = new ApiError(400, 'Invalid Request');
      //      throw error;
      //   }
      await transferService.createTransferService(userId, transferInfo);
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

module.exports = { createTransferController };
