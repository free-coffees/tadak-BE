import express from 'express';
const accountController = require('../controllers/accountController');
const auth = require('../middlewares/auth');
const accountAccess = require('../middlewares/accountAccess');
const createAccountInitialDataValidator = require('../middlewares/validators/createAccountInitalDataValidator');
const createAccountValidator = require('../middlewares/validators/createAccountValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account management
 */

/**
 * @swagger
 * /account:
 *   post:
 *     summary: create account
 *     security:
 *       - accessTokenAuth: []
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 example: 삼성증권
 *                 description: account's name.
 *               securitiesCompanyId:
 *                 type: integer
 *                 example: 7
 *                 description: account's Securities Company Id.
 *     responses:
 *       200:
 *         description: Login Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 계좌가 성공적으로 생성되었습니다.
 *       400:
 *         description: Invalid Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Request.
 */

router.post('/account', auth, createAccountValidator, accountController.createAccountController); // 계좌추가
router.put('/account', auth, accountAccess, accountController.updateAccountController); //계좌수정
router.delete('/account', auth, accountAccess, accountController.deleteAccountController); // 계좌삭제
router.get('/account/list', auth, accountController.getAccountListController); // 내 계좌 리스트 정보
router.post(
   '/account/init',
   auth,
   createAccountInitialDataValidator,
   accountAccess,
   accountController.createAccountInitialDataController,
); // 한번에 입력받기

module.exports = router;
