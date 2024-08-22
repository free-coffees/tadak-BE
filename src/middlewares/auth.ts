import { NextFunction, Request, Response } from 'express';
import ApiError from '../errorCuston/apiError';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const userRepo = require('../repositories/userRepository');

async function auth(req: Request, res: Response, next: NextFunction) {
   try {
      if (req.headers['access-token']) {
         const accessToken = req.headers['access-token'] as string;
         const decoded = await jwt.verify(accessToken, process.env.SECRET_KEY as string);
         if (typeof decoded == 'object') {
            const isExistedUser = await userRepo.readUserById(decoded.id);
            if (isExistedUser) {
               req.userId = decoded.id;
               next();
            } else {
               const error = new ApiError(401, '존재하지 않는 유저 입니다.');
               throw error;
            }
         } else {
            const error = new ApiError(401, 'Access Token 이 유효하지 않습니다.');
            throw error;
         }
      } else {
         const error = new ApiError(401, 'Access Token 이 포함되어 있지 않습니다.');
         throw error;
      }
   } catch (error) {
      if (error instanceof JsonWebTokenError) {
         if (error instanceof TokenExpiredError) {
            return res.status(419).json({ message: 'Access Token 이 만료되었습니다.' });
         } else {
            return res.status(401).json({ message: 'Access Token 이 유효하지 않습니다.' });
         }
      } else {
         const err = error as ApiError;
         return res.status(err.statusCode || 500).json({ message: err.message });
      }
   }
}

module.exports = auth;
