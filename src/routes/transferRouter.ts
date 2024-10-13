import express from 'express';
const transferController = require('../controllers/transferController');
const auth = require('../middlewares/auth');
const createTransferValidator = require('../middlewares/validators/createTransferValidator');
const updateTransferValidator = require('../middlewares/validators/updateTransferValidator');
const accountAccess = require('../middlewares/accountAccess');

const router = express.Router();

router.post('/transfer', auth, createTransferValidator, accountAccess, transferController.createTransferController); // 계좌 입출금
router.put('/transfer', auth, updateTransferValidator, accountAccess, transferController.updateTransferController); // 입출금 내역 수정
router.delete('/transfer', auth, transferController.deleteTransferController); // 입출금 내역 삭제

module.exports = router;
