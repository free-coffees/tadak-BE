import express from 'express';
const exchangeController = require('../controllers/exchangeController');
const auth = require('../middlewares/auth');
const createExchangeValidator = require('../middlewares/validators/createExchangeValidator');
const accountAccess = require('../middlewares/accountAccess');

const router = express.Router();

router.post('/api/exchange', auth, createExchangeValidator, accountAccess, exchangeController.createExchangeController); // 환전

module.exports = router;
