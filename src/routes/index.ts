import express from 'express';
const stockRouter = require('./stockRouter');
const userRouter = require('./userRouter');
const socialLoginRouter = require('./socialLoginRouter');
const accountRouter = require('./accountRouter');
const searchRouter = require('./searchRouter');
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     accessTokenAuth:
 *       type: apiKey
 *       in: header
 *       name: access-token
 *       description: Enter your JWT token in the format Bearer <token>
 *
 * security:
 *   - accessTokenAuth: []
 */

router.use(stockRouter);
router.use(userRouter);
router.use(socialLoginRouter);
router.use(accountRouter);
router.use(searchRouter);

module.exports = router;
