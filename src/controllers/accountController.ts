import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';

const accountService = require('../services/accountService');

async function createAccountController(req: Request, res: Response) {
   try {
      const userId = req.userId;
      const { accountName } = req.body;
      if (!accountName || accountName == '') {
         const error = new ApiError(400, 'Invalid Request');
         throw error;
      }
      await accountService.createAccountService(accountName, userId);
      return res.status(StatusCodes.OK).send({ message: 'Account is successfully created.' });
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { createAccountController };
