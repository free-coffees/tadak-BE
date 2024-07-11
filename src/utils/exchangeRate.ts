import axios from 'axios';
import https from 'https';
import crypto from 'crypto';
const cheerio = require('cheerio');

const allowLegacyRenegotiationforNodeJsOptions = {
   httpsAgent: new https.Agent({
      // for self signed you could also add
      rejectUnauthorized: false,
      // allow legacy server
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
   }),
};

async function getExchangeRate() {
   let retry = 0;
   let maxRetry = 3;
   while (retry < maxRetry) {
      try {
         const data = await axios({
            ...allowLegacyRenegotiationforNodeJsOptions,
            method: 'GET',
            url: 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON',
            params: {
               authkey: process.env.EXCHANGERATE_AUTH_KEY,
               data: 'AP01',
            },
         });
         let exchangeRate: number = 0;
         for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].cur_unit == 'USD') {
               exchangeRate = Number(data.data[i].deal_bas_r.replace(',', ''));
               console.log(data.data[i]);
            }
         } // 환율 db에 최신화 예정
         break;
      } catch (error) {
         console.log('에러');
         console.log(error);
         retry++;
      }
   }
}

async function getExchangeRateByCrawling() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/USD-KRW?hl=ko');
      const $ = cheerio.load(html.data);
      console.log($('div.kf1m0').text());
   } catch (error) {
      console.log(error);
   }
}

module.exports = getExchangeRateByCrawling;
