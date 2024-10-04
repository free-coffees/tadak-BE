import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCustom/apiError';
import { CreateAccountInitialDataDTO, CreateAccountRequest } from '../dto/accountDTO';

const accountService = require('../services/accountService');

async function createAccountController(req: Request, res: Response) {
   try {
      const userId = req.userId;
      const { accountName, securitiesCompanyId }: CreateAccountRequest = req.body;
      await accountService.createAccountService(userId, accountName, securitiesCompanyId);
      return res.status(StatusCodes.OK).send({ message: '새로운 계좌가 등록됐어요.' });
   } catch (error) {
      console.error('Account Creation Error :', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function createAccountInitialDataController(req: Request, res: Response) {
   try {
      const { accountId, balanceKRW, balanceUSD, holdings }: CreateAccountInitialDataDTO = req.body;
      await accountService.createAccountInitialDataService(accountId, balanceKRW, balanceUSD, holdings);
      return res.status(StatusCodes.OK).send({ message: '첫 주식 내역이 기록됐어요.' });
   } catch (error) {
      console.error('Account Initial Data Creation Error :', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function getAccountListController(req: Request, res: Response) {
   try {
      const userId = req.userId;
      const data = await accountService.getAccountListService(userId);
      return res.status(StatusCodes.OK).send(data);
   } catch (error) {
      console.error('Get Account List Error :', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function updateAccountController(req: Request, res: Response) {
   try {
      const { accountId, accountName, securitiesCompanyId } = req.body;
      await accountService.updateAccountService(accountId, accountName, securitiesCompanyId);
      return res.status(StatusCodes.OK).send({ message: '계좌 내용이 수정됐어요.' });
   } catch (error) {
      console.error('Account Update Error :', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function deleteAccountController(req: Request, res: Response) {
   try {
      const accountId = req.body.accountId;
      await accountService.deleteAccountService(accountId);
      return res.status(StatusCodes.OK).send({ message: '변경된 내용이 저장됐어요.' });
   } catch (error) {
      console.error('Account Delete Error :', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = {
   createAccountController,
   createAccountInitialDataController,
   getAccountListController,
   updateAccountController,
   deleteAccountController,
};
