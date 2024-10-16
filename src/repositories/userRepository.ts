import { read } from 'fs';

const db = require('../../database/index');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const user = db.user;

async function createUser(deviceId: string, nickname: string) {
   const data = await user.create({
      device_id: deviceId,
      nickname: nickname,
   });
   return data;
}

async function readUserByDeviceId(deviceId: string) {
   const data = await user.findOne({
      where: {
         device_id: deviceId,
      },
   });
   return data;
}

async function readUserById(userId: number) {
   const data = await user.findOne({
      where: {
         id: userId,
      },
      raw: true,
   });
   return data;
}

async function readUserByKakaoId(kakaoId: string) {
   const data = await user.findOne({
      where: {
         social_id: kakaoId,
      },
      raw: true,
   });
   return data;
}

async function updateRefreshToken(userId: number, refreshToken: string) {
   await user.update(
      {
         refresh_token: refreshToken,
      },
      {
         where: {
            id: userId,
         },
      },
   );
}

async function updateUserNickname(userId: number, nickname: string) {
   await user.update(
      {
         nickname: nickname,
      },
      {
         where: {
            id: userId,
         },
      },
   );
}

async function linkingKakao(deviceId: string, kakaoId: string) {
   const data = user.update(
      {
         social_id: kakaoId,
         device_id: null,
         social: 'kakao',
      },
      {
         where: {
            device_id: deviceId,
         },
      },
   );
   return data;
}

module.exports = {
   createUser,
   readUserByDeviceId,
   readUserById,
   readUserByKakaoId,
   updateRefreshToken,
   linkingKakao,
   updateUserNickname,
};
