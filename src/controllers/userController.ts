import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston.ts/apiError';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
const userService = require('../services/userService');

async function loginController(req: Request, res: Response) {
   try {
      const deviceId = req.headers['device-id'];
      const data = await userService.loginService(deviceId);
      return res.status(StatusCodes.OK).send({ data });
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function reissueAcessTokenController(req: Request, res: Response) {
   try {
      const refresh_token = req.headers['refresh-token']; // 400, refresh 필요
      const data = await userService.reissueAcessTokenService(refresh_token);
      return res.status(StatusCodes.OK).send({ data });
   } catch (error: any) {
      if (error instanceof JsonWebTokenError) {
         if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: 'Refresh Token 이 만료되었습니다.' });
         } else {
            return res.status(401).json({ message: 'Refresh Token 이 유효하지 않습니다.' });
         }
      } else {
         if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
         } else {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
         }
      }
   }
}

module.exports = { loginController, reissueAcessTokenController };
