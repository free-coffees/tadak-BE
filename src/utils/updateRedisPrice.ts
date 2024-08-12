import axios from 'axios';
const redisClient = require('../../database/redis');

async function updateRedisPrice() {
   try {
      const access_token = await redisClient.get('access_token');
      const list = await redisClient.hKeys('stock_prices');
      for (let i = 0; i < list.length; i++) {
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
               FID_INPUT_ISCD: list[i],
            },
         });
         await redisClient.hSet('stock_prices', list[i], data.data.output.stck_prpr);
      }
   } catch (error) {
      console.log(error);
   }
}

module.exports = updateRedisPrice;
