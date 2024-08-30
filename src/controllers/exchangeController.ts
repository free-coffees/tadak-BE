import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';
import { createExchangeDTO } from '../dto/exchangeDTO';

const exchangeService = require('../services/exchangeService');

async function createExchangeController(req: Request, res: Response) {
   try {
      const createExchangeDTO: createExchangeDTO = req.body;
      await exchangeService.createExchangeService(createExchangeDTO);
      return res.status(StatusCodes.OK).send({ message: '환전이 정상적으로 처리 되었습니다.' });
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { createExchangeController };
