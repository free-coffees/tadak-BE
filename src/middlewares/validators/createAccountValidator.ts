import { NextFunction, Request, Response } from 'express';
const { body, validationResult } = require('express-validator');

const createAccountValidator = [
   body('accountName')
      .isString()
      .withMessage('accountId 는 양수입니다.')
      .notEmpty()
      .withMessage('accountId 값 입력은 필수입니다.'),

   body('securitiesCompnayId')
      .isInt({ gt: 0 })
      .withMessage('securitiesCompanyId 는 양수입니다.')
      .notEmpty()
      .withMessage('securitiesCompanyId 값 입력은 필수입니다.'),

   (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         console.log(errors.array());
         return res.status(400).json({ message: errors.array()[0].msg });
      }
      next();
   },
];

module.exports = createAccountValidator;
