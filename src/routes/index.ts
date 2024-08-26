import express from 'express';
const stockRouter = require('./stockRouter');
const userRouter = require('./userRouter');
const socialLoginRouter = require('./socialLoginRouter');
const accountRouter = require('./accountRouter');
const searchRouter = require('./searchRouter');
const transferRouter = require('./transferRouter');
const transactionRouter = require('./transactionRouter');
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     accessTokenAuth:
 *       type: apiKey
 *       in: header
 *       name: access-token
 *       description: Enter your Access Token
 *
 * security:
 *   - accessTokenAuth: []
 */

router.use(stockRouter);
router.use(userRouter);
router.use(socialLoginRouter);
router.use(accountRouter);
router.use(searchRouter);
router.use(transferRouter);
router.use(transactionRouter);

module.exports = router;
