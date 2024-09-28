import jwt from 'jsonwebtoken';
import ApiError from '../errorCustom/apiError';
const userRepo = require('../repositories/userRepository');
const secret_key = process.env.SECRET_KEY as string;

async function loginService(
   deviceId: string,
): Promise<{ access_token: string; refresh_token: string; nickname: string }> {
   let isExistedUser = await userRepo.readUserByDeviceId(deviceId);
   const nickname1 = ['미래의', '조만간', '언젠간'];
   const nickname2 = ['백만장자', '경제적자유인', '주식고수'];
   let nickname = '';

   if (!isExistedUser) {
      // 최초 진입 유저인 경우 계정 생성
      nickname = nickname1[Math.floor(Math.random() * 3)] + nickname2[Math.floor(Math.random() * 3)];
      isExistedUser = await userRepo.createUser(deviceId, nickname);
   }

   nickname = isExistedUser.nickname;

   const payload = {
      id: isExistedUser.id,
   };

   const accessToken = jwt.sign(payload, secret_key, {
      algorithm: 'HS256',
      expiresIn: '12h',
   });

   const refreshToken = jwt.sign(payload, secret_key, {
      algorithm: 'HS256',
      expiresIn: '7 days',
   });

   await userRepo.updateRefreshToken(isExistedUser.id, refreshToken);

   return { access_token: accessToken, refresh_token: refreshToken, nickname };
}

async function reissueAcessTokenService(refreshToken: string) {
   let accessToken: string = '';
   const decoded = await jwt.verify(refreshToken, secret_key);
   if (typeof decoded == 'string') {
      const error = new ApiError(401, 'Refresh Token is not valid.');
      throw error;
   } else {
      const isExistedUser = await userRepo.readUserById(decoded.id);
      if (isExistedUser.refresh_token == refreshToken) {
         const payload = {
            id: decoded.id,
         };
         accessToken = jwt.sign(payload, secret_key, {
            algorithm: 'HS256',
            expiresIn: '12h',
         });
      } else {
         const error = new ApiError(401, 'Refresh Token is not valid.');
         throw error;
      }
   }
   return { access_token: accessToken };
}

async function updateUserNicknameService(userId: number, nickname: string) {
   await userRepo.updateUserNickname(userId, nickname);
}

module.exports = { loginService, reissueAcessTokenService, updateUserNicknameService };
