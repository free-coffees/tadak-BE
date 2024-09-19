import axios from 'axios';
const redisClient = require('../../database/redis');
const stockRepo = require('../repositories/stockRepository');

async function addRedisPrice(itemCode: string) {
   // redis 에 등록해주고 현재가 리턴
   const accessToken = await redisClient.get('access_token');
   const stock = await stockRepo.readStockByCode(itemCode);
   const isExistedPrice = await redisClient.hGet('stock_prices', itemCode);
   if (!isExistedPrice) {
      if (stock.market == 'NYSE' || stock.market == 'AMEX' || stock.market == 'NASDAQ') {
         let market;
         if (stock.market == 'NYSE') {
            market = 'NYS';
         } else if (stock.market == 'AMEX') {
            market = 'AMS';
         } else if (stock.market == 'NASDAQ') {
            market = 'NAS';
         }
         const data = await axios({
            method: 'GET',
            url: 'https://openapi.koreainvestment.com:9443/uapi/overseas-price/v1/quotations/price',
            headers: {
               'Content-Type': 'application/json; charset=UTF-8',
               authorization: 'Bearer ' + accessToken,
               appkey: process.env.STOCK_KEY,
               appsecret: process.env.STOCK_SECRET_KEY,
               tr_id: 'HHDFS00000300',
            },
            params: {
               AUTH: '',
               EXCD: market,
               SYMB: itemCode,
            },
         });
         await redisClient.hSet('stock_prices', itemCode, data.data.output.last);
         return data.data.output.last;
      } else {
         const data = await axios({
            method: 'GET',
            url: 'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price',
            headers: {
               'Content-Type': 'application/json; charset=UTF-8',
               authorization: 'Bearer ' + accessToken,
               appkey: process.env.STOCK_KEY,
               appsecret: process.env.STOCK_SECRET_KEY,
               tr_id: 'FHKST01010100',
            },
            params: {
               FID_COND_MRKT_DIV_CODE: 'J',
               FID_INPUT_ISCD: itemCode,
            },
         });
         await redisClient.hSet('stock_prices', itemCode, data.data.output.stck_prpr);
         return data.data.output.stck_prpr;
      }
   }
}

module.exports = addRedisPrice;
