import { NextFunction, Request, Response } from 'express';
const { body, validationResult } = require('express-validator');

const updateTransferValidator = [
   body('accountId')
      .notEmpty()
      .withMessage('accountId 값 입력은 필수입니다.')
      .isInt({ gt: 0 })
      .withMessage('accountId 는 양수입니다.'),

   body('transferId')
      .notEmpty()
      .withMessage('transferId 값 입력은 필수입니다.')
      .isInt({ gt: 0 })
      .withMessage('transferId 는 양수입니다.'),

   body('transferDate')
      .notEmpty()
      .withMessage('날짜 값 입력은 필수입니다.')
      .isISO8601()
      .withMessage('올바른 날짜를 입력해주세요.'),

   body('transferType')
      .notEmpty()
      .withMessage('거래 유형은 deposit 또는 withdrawal 이어야 합니다.')
      .isIn(['deposit', 'withdrawal'])
      .withMessage('거래 유형은 deposit 또는 withdrawal 이어야 합니다.'),

   body('amount')
      .notEmpty()
      .withMessage('금액 값 입력은 필수입니다.')
      .isFloat({ gt: 0 })
      .withMessage('금액은 양수입니다.'),

   body('currency')
      .notEmpty()
      .withMessage('통화는 krw 또는 usd 이어야 합니다.')
      .isIn(['krw', 'usd'])
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

module.exports = updateTransferValidator;
