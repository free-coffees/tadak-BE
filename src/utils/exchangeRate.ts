import axios from 'axios';
import https from 'https';
import crypto from 'crypto';

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
         console.log(exchangeRate);
         break;
      } catch (error) {
         console.log('에러');
         console.log(error);
         retry++;
      }
   }
}

module.exports = getExchangeRate;
