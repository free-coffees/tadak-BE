import jwt from 'jsonwebtoken';
import ApiError from '../errorCuston/apiError';
const userRepo = require('../repositories/userRepository');
const secret_key = process.env.SECRET_KEY as string;

async function loginService(deviceId: string): Promise<{ accessToken: string; refreshToken: string }> {
   let isExistedUser = await userRepo.readUserByDeviceId(deviceId);

   if (!isExistedUser) {
      // 최초 진입 유저인 경우 계정 생성
      isExistedUser = await userRepo.createUser(deviceId);
   }

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

   return { accessToken, refreshToken };
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
   return { accessToken };
}

module.exports = { loginService, reissueAcessTokenService };
