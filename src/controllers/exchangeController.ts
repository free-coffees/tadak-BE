import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCustom/apiError';
import { CreateExchangeDTO } from '../dto/exchangeDTO';

const exchangeService = require('../services/exchangeService');

async function createExchangeController(req: Request, res: Response) {
   try {
      const createExchangeDTO: CreateExchangeDTO = req.body;
      await exchangeService.createExchangeService(createExchangeDTO);
      return res.status(StatusCodes.OK).send({ message: '환전이 정상적으로 처리 되었습니다.' });
   } catch (error) {
      console.error('Exchange Error : ', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { createExchangeController };
