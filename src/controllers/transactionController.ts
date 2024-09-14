import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';
import { createTransactionDTO } from '../dto/transactionDTO';

const transactionService = require('../services/transactionService');

async function createTransactionController(req: Request, res: Response) {
   try {
      const createTransactionDTO: createTransactionDTO = req.body;
      await transactionService.createTransactionService(createTransactionDTO);
      return res.status(StatusCodes.OK).send({ message: '매매가 정상적으로 처리 되었습니다.' });
   } catch (error) {
      console.error('Transaction Error:', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { createTransactionController };
