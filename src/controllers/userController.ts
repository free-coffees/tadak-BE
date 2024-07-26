import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/api.error';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
const userService = require('../services/userService');

async function loginController(req: Request, res: Response) {
   try {
      const deviceId = req.headers['device-id'];
      const data = await userService.loginService(deviceId);
      return res.status(StatusCodes.OK).send({ data });
   } catch (error) {
      const err = error as ApiError;
      return res.status(err.statusCode || 500).json({ message: err.message });
   }
}

async function reissueAcessTokenController(req: Request, res: Response) {
   try {
      const refresh_token = req.headers['refresh-token'];
      const data = await userService.reissueAcessTokenService(refresh_token);
      return res.status(StatusCodes.OK).send({ data });
   } catch (error: any) {
      if (error instanceof JsonWebTokenError) {
         if (error.name == 'TokenExpiredError') {
            return res.status(419).json({ message: 'Refresh Token 이 만료되었습니다.' });
         } else {
            return res.status(401).json({ message: 'Refresh Token 이 유효하지 않습니다.' });
         }
      } else {
         const err = error as ApiError;
         return res.status(err.statusCode || 500).json({ message: err.message });
      }
   }
}

module.exports = { loginController, reissueAcessTokenController };
