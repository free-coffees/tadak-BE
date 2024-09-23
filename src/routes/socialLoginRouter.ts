import express from 'express';
const socialLoginController = require('../controllers/socialLoginController');
const router = express.Router();

router.get('/api/kakao/login', socialLoginController.kakaoLoginController); // 카카오 로그인
router.get('/api/kakao/callback', socialLoginController.kakaoAuthController); // 카카오 콜백

module.exports = router;
