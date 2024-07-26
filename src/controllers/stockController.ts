import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/api.error';
import axios, { AxiosError } from 'axios';

const stockService = require('../services/stockService');
const getApiToken = require('../utils/getApiToken');

async function getTokenController(req: Request, res: Response) {
   try {
      const data = await getApiToken();
      return res.status(StatusCodes.OK).send({ data });
   } catch (error: any) {
      if (axios.isAxiosError(error)) {
         if (error.response?.data) {
            return res.status(error.response?.status || 500).json({ message: error.response?.data.error_description });
         } else {
            return res.status(error.response?.status || 500).json({ message: error.response?.statusText });
         }
      } else {
         const err = error as ApiError;
         console.log(err);
         return res.status(err.statusCode || 500).json({ message: err.message });
      }
   }
}

async function readKRCurrentPriceController(req: Request, res: Response) {
   try {
      const itemCode: string = req.params.id;
      const data = await stockService.readKRCurrentPriceService(itemCode);
      console.log(data);
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
         const err = error as ApiError;
         return res.status(err.statusCode || 500).json({ message: err.message });
      }
   }
}

async function readUSCurrentPriceController(req: Request, res: Response) {
   try {
      const itemCode: string = req.params.id;
      const data = await stockService.readUSCurrentPriceService(itemCode);
      return res.status(StatusCodes.OK).send({ data });
   } catch (error) {
      if (error instanceof AxiosError) {
         if (error.response?.data.msg1) {
            //토큰문제
            return res.status(error.response?.status || 500).json({ message: error.response?.data.msg1 }); // 잘못400 만료 401
         } else {
            return res.status(error.response?.status || 500).json({ message: error.response?.statusText });
         }
      } else {
         const err = error as ApiError;
         return res.status(err.statusCode || 500).json({ message: err.message });
      }
   }
}

module.exports = {
   getTokenController,
   readKRCurrentPriceController,
   readUSCurrentPriceController,
};
