import express from 'express';
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/auth');
const createTransactionValidator = require('../middlewares/validators/createTransactionValidator');
const accountAccess = require('../middlewares/accountAccess');

const router = express.Router();

router.post(
   '/transaction',
   auth,
   createTransactionValidator,
   accountAccess,
   transactionController.createTransactionController,
); // 주식 매수/매도

module.exports = router;
