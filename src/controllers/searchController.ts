import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/api.error';

const searchService = require('../services/searchService');

async function getSearchListController(req: Request, res: Response) {
   try {
      const searchWord: string = String(req.query.word);
      const data = await searchService.getSearchListService(searchWord);
      if (data.length == 0) {
         return res.status(StatusCodes.NO_CONTENT).send({ message: '검색 결과가 존재하지 않습니다.' }); //204 body x
      } else {
         return res.status(StatusCodes.OK).send({ data });
      }
   } catch (error) {
      const err = error as ApiError;
      console.log(err);
      return res.status(err.statusCode || 500).json({ message: err.message });
   }
}

module.exports = { getSearchListController };
