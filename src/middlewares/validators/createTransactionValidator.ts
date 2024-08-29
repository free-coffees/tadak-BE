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
      .withMessage('거래 유형은 buy 또는 sell 이어야 합니다.')
      .notEmpty()
      .withMessage('거래 유형은 buy 또는 sell 이어야 합니다.'),

   body('quantity')
      .isInt({ gt: 0 })
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
      .withMessage('통화는 krw 또는 usd 이어야 합니다.')
      .notEmpty()
      .withMessage('통화는 krw 또는 usd 이어야 합니다.'),

   (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         console.log(errors.array());
         return res.status(400).json({ message: errors.array()[0].msg });
      }
      next();
   },
];

module.exports = createTransactionValidator;
