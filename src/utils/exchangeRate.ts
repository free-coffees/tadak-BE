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
         console.log(data.data); // 환율 db에 최신화 예정
         break;
      } catch (error) {
         console.log('에러');
         console.log(error);
         retry++;
      }
   }
}

module.exports = getExchangeRate;
