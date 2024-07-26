import jwt from 'jsonwebtoken';
import ApiError from '../utils/api.error';
const userRepo = require('../repositories/userRepository');
const secret_key = process.env.SECRET_KEY as string;

async function loginService(deviceId: string): Promise<{ access_token: string; refresh_token: string }> {
   let isExistedUser = await userRepo.readUserByDeviceId(deviceId);

   if (!isExistedUser) {
      // 최초 진입 유저인 경우 계정 생성
      isExistedUser = await userRepo.createUser(deviceId);
   }

   const payload = {
      id: isExistedUser.id,
   };

   const access_token = jwt.sign(payload, secret_key, {
      algorithm: 'HS256',
      expiresIn: '1 days',
   });

   const refresh_token = jwt.sign(payload, secret_key, {
      algorithm: 'HS256',
      expiresIn: '7 days',
   });

   await userRepo.updateRefreshToken(isExistedUser.id, refresh_token);

   return { access_token, refresh_token };
}

async function reissueAcessTokenService(refresh_token: string) {
   let access_token: string = '';
   const decoded = jwt.verify(refresh_token, secret_key);
   if (typeof decoded == 'string') {
      const error = new ApiError(401, 'Refresh Token 이 유효하지 않습니다.');
      throw error;
   } else {
      const isExistedUser = await userRepo.readUserById(decoded.id);
      if (isExistedUser.refresh_token == refresh_token) {
         const payload = {
            id: decoded.id,
         };
         access_token = jwt.sign(payload, secret_key, {
            algorithm: 'HS256',
            expiresIn: '1 days',
         });
      } else {
         const error = new ApiError(401, 'Refresh Token 이 유효하지 않습니다.');
         throw error;
      }
   }
   return { access_token };
}

module.exports = { loginService, reissueAcessTokenService };
