import axios from 'axios';
const redisClient = require('../../database/redis');
const stockRepo = require('../repositories/stockRepository');

async function updateRedisPrice() {
   try {
      const accessToken = await redisClient.get('access_token');
      const list = await redisClient.hKeys('stock_prices');
      for (let i = 0; i < list.length; i++) {
         const stock = await stockRepo.readStockByCode(list[i]);
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
                  SYMB: list[i],
               },
            });
            await redisClient.hSet('stock_prices', list[i], data.data.output.last);
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
                  FID_INPUT_ISCD: list[i],
               },
            });
            await redisClient.hSet('stock_prices', list[i], data.data.output.stck_prpr);
         }
      }
   } catch (error) {
      console.error('Update Redis Price Error : ', error);
   }
}

module.exports = updateRedisPrice;
