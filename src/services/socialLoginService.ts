import axios from 'axios';
import jwt from 'jsonwebtoken';
const userRepo = require('../repositories/userRepository');
const secret_key = process.env.SECRET_KEY as string;

async function getKakaoCodeService(deviceId: string) {
   const data = await axios({
      method: 'GET',
      url: 'https://kauth.kakao.com/oauth/authorize',
      params: {
         response_type: 'code',
         client_id: process.env.KAKAO_APP_KEY,
         redirect_uri: process.env.KAKAO_REDIRECT_URI,
         state: deviceId,
      },
   });
   return data;
}

async function kakaoLoginService(authCode: string, deviceId: string) {
   const data = await getKakaoTokenService(authCode);
   const accessToken = data.data.access_token;
   const userInfo = await getKakaoUserInfoService(accessToken);
   const isExistedUser = await userRepo.readUserByKakaoId(userInfo.id);
   // 카카오 연동 된 계정이 있는지 확인
   // 1. 있으면 그 계정으로 로그인(추후 현재 device와 연동된 데이터 둘중에 고를수있게) 2. 없으면 현재 device id 찾아서 연동
   if (isExistedUser) {
      const payload = {
         id: isExistedUser.id,
      };
      const accessToken = jwt.sign(payload, secret_key, {
         algorithm: 'HS256',
         expiresIn: '1 days',
      });

      const refreshToken = jwt.sign(payload, secret_key, {
         algorithm: 'HS256',
         expiresIn: '7 days',
      });
      await userRepo.updateRefreshToken(isExistedUser.id, refreshToken);
      return { accessToken, refreshToken };
   } else {
      await userRepo.linkingKakao(deviceId, userInfo.id);
      const user = await userRepo.readUserByKakaoId(userInfo.id);
      const payload = {
         id: user.id,
      };
      const accessToken = jwt.sign(payload, secret_key, {
         algorithm: 'HS256',
         expiresIn: '1 days',
      });

      const refreshToken = jwt.sign(payload, secret_key, {
         algorithm: 'HS256',
         expiresIn: '7 days',
      });
      await userRepo.updateRefreshToken(user.id, refreshToken);
      return { accessToken, refreshToken };
   }
}

async function getKakaoTokenService(authCode: string) {
   const data = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
         grant_type: 'authorization_code',
         client_id: process.env.KAKAO_APP_KEY,
         redirect_uri: process.env.KAKAO_REDIRECT_URI,
         code: authCode,
         client_secret: process.env.KAKAO_SECRET_KEY,
      },
   });
   return data;
}

async function getKakaoUserInfoService(accessToken: string) {
   const data = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
         Authorization: 'Bearer ' + accessToken,
         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
   });
   return data.data;
}

module.exports = { getKakaoCodeService, kakaoLoginService };
