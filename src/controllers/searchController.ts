import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';

const searchService = require('../services/searchService');

async function getSearchListController(req: Request, res: Response) {
   try {
      const searchWord: string = String(req.query.word);
      const page: number = Number(req.query.page);
      const data = await searchService.getSearchListService(searchWord, page);
      return res.status(StatusCodes.OK).send(data);
   } catch (error) {
      console.error('Get Search List Error : ', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function updateSearchFrequencyController(req: Request, res: Response) {
   try {
      const stockId: number = Number(req.params.stockId);
      if (!stockId) {
         const error = new ApiError(400, 'stockId is required');
         throw error;
      } //validation 부분으로 이동 예정
      await searchService.updateSearchFrequencyService(stockId);
      return res.status(StatusCodes.OK).send({ message: 'Search Frequency is updated' });
   } catch (error) {
      console.error('Update Search Freq Error : ', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { getSearchListController, updateSearchFrequencyController };
