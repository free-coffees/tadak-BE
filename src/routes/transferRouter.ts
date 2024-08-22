import express from 'express';
const accountController = require('../controllers/accountController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/account', auth, accountController.createAccountController); // 계좌추가

module.exports = router;
