import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/api.error';

const searchService = require('../services/searchService');

async function getSearchListController(req: Request, res: Response) {
   try {
      console.log(req.userId);
      const searchWord: string = String(req.query.word);
      const data = await searchService.getSearchListService(searchWord);
      if (data.length == 0) {
         return res.status(StatusCodes.NO_CONTENT).send({ message: '검색 결과가 존재하지 않습니다.' }); //204 body x
      } else {
         return res.status(StatusCodes.OK).send({ data });
      }
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { getSearchListController };
