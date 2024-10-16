import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCustom/apiError';
import axios, { AxiosError } from 'axios';

const stockService = require('../services/stockService');

async function readCurrentPriceController(req: Request, res: Response) {
   try {
      const itemCode: string = req.params.id;
      const data = await stockService.readCurrentPriceService(itemCode);
      return res.status(StatusCodes.OK).send({ data });
   } catch (error: any) {
      if (axios.isAxiosError(error)) {
         if (error.response?.data.msg1) {
            //토큰문제
            return res.status(error.response?.status || 500).json({ message: error.response?.data.msg1 }); // 잘못400 만료 401
         } else {
            return res.status(error.response?.status || 500).json({ message: error.response?.statusText });
         }
      } else {
         if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
         } else {
            return res.status(500).json({ message: 'Internal Server Error' });
         }
      }
   }
}

module.exports = {
   readCurrentPriceController,
};
