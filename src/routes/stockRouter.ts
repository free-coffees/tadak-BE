import express from 'express';
const stockController = require('../controllers/stockController');

const router = express.Router();

router.get('/stock/:id', stockController.readCurrentPriceController); // 해당 종목 현재가

module.exports = router;
