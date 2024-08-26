import { NextFunction, Request, Response } from 'express';
const { body, validationResult } = require('express-validator');

const createTransferValidator = [
   body('accountId')
      .isInt({ gt: 0 })
      .withMessage('accountId 는 양수입니다.')
      .notEmpty()
      .withMessage('accountId 값 입력은 필수입니다.'),

   body('transferDate')
      .isISO8601()
      .withMessage('올바른 날짜를 입력해주세요.')
      .notEmpty()
      .withMessage('날짜 값 입력은 필수입니다.'),

   body('transferType')
      .isIn(['deposit', 'withdrawal'])
      .withMessage('입금 출금 중에 입력해주세요.')
      .notEmpty()
      .withMessage('입출금 값 입력은 필수입니다.'),
   body('amount')
      .isFloat({ gt: 0 })
      .withMessage('금액은 양수입니다.')
      .notEmpty()
      .withMessage('금액 값 입력은 필수입니다.'),

   body('currency')
      .isIn(['krw', 'usd'])
      .withMessage('원화 달러 중에 입력해주세요.')
      .notEmpty()
      .withMessage('통화 값 입력은 필수입니다.'),

   (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         console.log(errors.array());
         return res.status(400).json({ message: errors.array()[0].msg });
      }
      next();
   },
];

module.exports = createTransferValidator;
