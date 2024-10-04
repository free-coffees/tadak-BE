import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCustom/apiError';
import { CreateTransferDTO } from '../dto/transferDTO';

const transferService = require('../services/transferService');

async function createTransferController(req: Request, res: Response) {
   try {
      const createTransferDTO: CreateTransferDTO = req.body;
      await transferService.createTransferService(createTransferDTO);
      return res.status(StatusCodes.OK).send({ message: '입출금이 정상적으로 처리 되었습니다.' });
   } catch (error) {
      console.error('Transfer Error:', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { createTransferController };
