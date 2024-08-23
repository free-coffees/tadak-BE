import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';

const transferService = require('../services/transferService');

async function createTransferController(req: Request, res: Response) {
   try {
      const userId = req.userId;
      const createTransferDTO = req.body;
      await transferService.createTransferService(userId, createTransferDTO);
      return res.status(StatusCodes.OK).send({ message: 'Deposit/Withdrawl Success' });
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
