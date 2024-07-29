import express from 'express';
const userController = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: device-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Login Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzIyMjM1NzkxLCJleHAiOjE3MjIyMzU4NTF9.m7790_AD5P_oDTXCz4b9CwVK7pjn8b70UOZWojL4Kic
 *                     refresh_token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzIyMjM1NzkxLCJleHAiOjE3MjIyMzYwOTF9.2WUst69Ta9qVPFDQ0HetHB1CsUt43Xg2sEkH_VGH8mM
 *
 */

router.post('/user/login', userController.loginController); // 로그인요청 => at rt 발급
router.post('/user/refresh', userController.reissueAcessTokenController); // at 재발급
module.exports = router;
