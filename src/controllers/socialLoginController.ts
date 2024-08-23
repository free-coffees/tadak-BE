import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCuston/apiError';
const socialLoginService = require('../services/socialLoginService');

async function kakaoLoginController(req: Request, res: Response) {
   try {
      const deviceId = req.query.deviceId; // 추후 access_token으로 대체
      return res.redirect(
         `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_APP_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&state=${deviceId}`,
      );
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function kakaoAuthController(req: Request, res: Response) {
   try {
      const authCode = req.query.code;
      const deviceId = req.query.state;
      const data = await socialLoginService.kakaoLoginService(authCode, deviceId);
      return res.redirect(
         `http://localhost:3000/loginRedirect?access_token=${data.accessToken}&refresh_token=${data.refreshToken}`,
      ); // redirect
   } catch (error) {
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         console.log(error);
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { kakaoLoginController, kakaoAuthController };
