import { NextFunction, Request, Response } from 'express';
const { body, validationResult } = require('express-validator');

const createAccountInitialDataValidator = [
   body('accountId')
      .isInt({ gt: 0 })
      .withMessage('accountId 는 양수입니다.')
      .notEmpty()
      .withMessage('accountId 값 입력은 필수입니다.'),

   body('balanceKRW')
      .isFloat({ gte: 0 })
      .withMessage('원화 값은 양수입니다.')
      .notEmpty()
      .withMessage('원화 값 입력은 필수입니다.'),

   body('balanceUSD')
      .isFloat({ gte: 0 })
      .withMessage('달러 값은 양수입니다.')
      .notEmpty()
      .withMessage('달러 값 입력은 필수입니다.'),

   body('holdings').isArray({ min: 1 }).withMessage('주식 보유 배열이 비어있습니다.'),

   body('holdings.*.stockId')
      .isInt({ gt: 0 })
      .withMessage('stockId 는 양수입니다.')
      .notEmpty()
      .withMessage('stockId 값 입력은 필수입니다.'),

   body('holdings.*.transactionDate')
      .isISO8601()
      .withMessage('올바른 날짜를 입력해주세요.')
      .notEmpty()
      .withMessage('날짜 값 입력은 필수입니다.'),

   body('holdings.*.quantity')
      .isInt({ gt: 0 })
      .withMessage('수량은 양수입니다.')
      .notEmpty()
      .withMessage('수량 값 입력은 필수입니다.'),

   body('holdings.*.averagePrice')
      .isFloat({ gt: 0 })
      .withMessage('가격은 양수입니다.')
      .notEmpty()
      .withMessage('가격 값 입력은 필수입니다.'),

   body('holdings.*.currency')
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

module.exports = createAccountInitialDataValidator;
