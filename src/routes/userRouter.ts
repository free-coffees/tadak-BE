import express from 'express';
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/user/login', userController.loginController); // 로그인요청 => at rt 발급
router.post('/user/refresh', userController.reissueAcessTokenController); // at 재발급
module.exports = router;
