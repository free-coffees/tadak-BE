import axios from 'axios';

const access_token =
   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjllMzg0M2FiLTU2MGUtNDAxOS05YmEzLTFmMWU1YTc5NzFhNSIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcyMDY3ODQzOCwiaWF0IjoxNzIwNTkyMDM4LCJqdGkiOiJQU1dvRGtrNHpOZ0ppNTc2dFVVUWNiRlZCRlliZEUwcVFmdGsifQ.WHLuWumhjilqv09tsQDnBQ0e4N7HAsB5RwZrk2-Y-bu0OxodDHhcFXL-jmUrCrtRZ1J5p3dTweT3tfKMP-okjQ';

async function getTokenService() {
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
   return data.data.access_token;
}

async function readKRCurrentPriceService(itemCode: string) {
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
   //await getExchangeRate();
   //console.log(data.data.output);
   return data.data.output.stck_prpr;
}

async function readUSCurrentPriceService(itemCode: string) {
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
   //console.log(data.data.output);
   return data.data.output.last;
}

module.exports = {
   getTokenService,
   readKRCurrentPriceService,
   readUSCurrentPriceService,
};
