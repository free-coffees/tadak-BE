import express from 'express';
const searchController = require('../controllers/searchController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/search', auth, searchController.getSearchListController); // 검색
router.post('/search/:stockId', auth, searchController.updateSearchFrequencyController); // 매수 매도 등 검색창에서 해당 종목 클릭시 요청(검색빈도 업데이트)

module.exports = router;
