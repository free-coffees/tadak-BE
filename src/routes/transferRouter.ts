import express from 'express';
const transferController = require('../controllers/transferController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/transfer', auth, transferController.createTransferController); // 계좌 입출금

module.exports = router;
