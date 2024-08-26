import { NextFunction, Request, Response } from 'express';
const { body, validationResult } = require('express-validator');

const createTransactionValidator = [
   body('accountId')
      .isInt({ gt: 0 })
      .withMessage('accountId 는 양수입니다.')
      .notEmpty()
      .withMessage('accountId 값 입력은 필수입니다.'),

   body('stockId')
      .isInt({ gt: 0 })
      .withMessage('stockId 는 양수입니다.')
      .notEmpty()
      .withMessage('stockId 값 입력은 필수입니다.'),

   body('transactionDate')
      .isISO8601()
      .withMessage('올바른 날짜를 입력해주세요.')
      .notEmpty()
      .withMessage('날짜 값 입력은 필수입니다.'),

   body('transactionType')
      .isIn(['buy', 'sell'])
      .withMessage('매수 매도 중에 입력해주세요.')
      .notEmpty()
      .withMessage('거래유형 값 입력은 필수입니다.'),

   body('quantity')
      .isFloat({ gt: 0 })
      .withMessage('수량은 양수입니다.')
      .notEmpty()
      .withMessage('수량 값 입력은 필수입니다.'),

   body('price')
      .isFloat({ gt: 0 })
      .withMessage('가격은 양수입니다.')
      .notEmpty()
      .withMessage('가격 값 입력은 필수입니다.'),

   body('currency')
      .isIn(['krw', 'usd'])
      .withMessage('원화 달러 중에 입력해주세요.')
      .notEmpty()
      .withMessage('통화 값 입력은 필수입니다.'),

   (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         console.log(errors.array());
         return res.status(400).json({ errors: errors.array() });
      }
      next();
   },
];

module.exports = createTransactionValidator;
