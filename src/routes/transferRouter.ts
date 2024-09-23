import express from 'express';
const transferController = require('../controllers/transferController');
const auth = require('../middlewares/auth');
const createTransferValidator = require('../middlewares/validators/createTransferValidator');
const accountAccess = require('../middlewares/accountAccess');

const router = express.Router();

router.post('/api/transfer', auth, createTransferValidator, accountAccess, transferController.createTransferController); // 계좌 입출금

module.exports = router;
