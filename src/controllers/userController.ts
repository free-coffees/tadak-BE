import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
const userService = require('../services/userService');

async function loginController(req: Request, res: Response) {
   try {
      const deviceId = req.headers['device-id'];
      const data = await userService.loginService(deviceId);
      return res.status(StatusCodes.OK).send(data);
   } catch (error) {
      console.error('Login Error : ', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function reissueAcessTokenController(req: Request, res: Response) {
   try {
      const refreshToken = req.headers['refresh-token']; // 400, refresh 필요
      const data = await userService.reissueAcessTokenService(refreshToken);
      return res.status(StatusCodes.OK).send(data);
   } catch (error: any) {
      console.error('Reissue AT Error : ', error);
      if (error instanceof JsonWebTokenError) {
         if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: 'Refresh Token is expired.' });
         } else {
            return res.status(401).json({ message: 'Refresh Token is not valid' });
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

async function updateUserNicknameController(req: Request, res: Response) {
   try {
      const userId = req.userId;
      const nickname = req.body.nickname;
      await userService.updateUserNicknameService(userId, nickname);
      return res.status(StatusCodes.OK).send({ message: '닉네임이 수정 완료 되었습니다.' });
   } catch (error) {
      console.error('Update User Nickname Error : ', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { loginController, reissueAcessTokenController, updateUserNicknameController };
