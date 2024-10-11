import express from 'express';
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/user/login', userController.loginController); // 로그인요청 => at rt 발급
router.post('/user/refresh', userController.reissueAccessTokenController); // at 재발급
router.put('/user/nickname', auth, userController.updateUserNicknameController); // 닉네임 수정
module.exports = router;
