import axios from 'axios';
const redisClient = require('../../database/redis');

async function updateRedisApiToken() {
   try {
      const data = await axios({
         method: 'POST',
         url: 'https://openapi.koreainvestment.com:9443/oauth2/tokenP',
         headers: {
            'Content-Type': 'application/json; charset=UTF-8',
         },
         data: {
            grant_type: 'client_credentials',
            appkey: process.env.STOCK_KEY,
            appsecret: process.env.STOCK_SECRET_KEY,
         },
      });
      await redisClient.set('access_token', data.data.access_token);
      console.log('update api token');
   } catch (error: any) {
      console.log(error.response.data);
   }
}

module.exports = updateRedisApiToken;
