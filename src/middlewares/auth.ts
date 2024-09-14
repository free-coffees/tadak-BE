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
               const error = new ApiError(401, 'User is not existed.');
               throw error;
            }
         } else {
            const error = new ApiError(401, 'Access Token is not valid.');
            throw error;
         }
      } else {
         const error = new ApiError(401, 'Access Token is not included.');
         throw error;
      }
   } catch (error) {
      console.error('Auth Error : ', error);
      if (error instanceof JsonWebTokenError) {
         if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: 'Access Token is expired.' });
         } else {
            return res.status(401).json({ message: 'Access Token is not valid' });
         }
      } else if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = auth;
