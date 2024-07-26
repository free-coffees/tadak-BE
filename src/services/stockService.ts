import axios from 'axios';
const apiTokenRepo = require('../repositories/apiTokenRepository');
const redisClient = require('../../database/redis');

async function readKRCurrentPriceService(itemCode: string) {
   const token = await apiTokenRepo.readApiToken();
   const access_token = token.access_token;

   const isExistedPrice = await redisClient.hGet('stock_prices', itemCode);
   if (isExistedPrice) {
      console.log('redis에 있다!');
      return isExistedPrice;
   } else {
      const data = await axios({
         method: 'GET',
         url: 'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price',
         headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            authorization: 'Bearer ' + access_token,
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
      console.log('redis에 없다!');
      return data.data.output.stck_prpr;
   }
}

async function readUSCurrentPriceService(itemCode: string) {
   const token = await apiTokenRepo.readApiToken();
   const access_token = token.access_token;
   const data = await axios({
      method: 'GET',
      url: 'https://openapi.koreainvestment.com:9443/uapi/overseas-price/v1/quotations/price',
      headers: {
         'Content-Type': 'application/json; charset=UTF-8',
         authorization: 'Bearer ' + access_token,
         appkey: process.env.STOCK_KEY,
         appsecret: process.env.STOCK_SECRET_KEY,
         tr_id: 'HHDFS00000300',
      },
      params: {
         AUTH: '',
         EXCD: 'BAQ',
         SYMB: itemCode,
      },
   });
   return data.data.output.last;
}

module.exports = {
   readKRCurrentPriceService,
   readUSCurrentPriceService,
};
