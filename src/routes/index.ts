import express from 'express';
const stockRouter = require('./stockRouter');
const userRouter = require('./userRouter');
const socialLoginRouter = require('./socialLoginRouter');
const router = express.Router();

router.use(stockRouter);
router.use(userRouter);
router.use(socialLoginRouter);

module.exports = router;
