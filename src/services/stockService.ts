import axios from 'axios';
const getExchangeRate = require('../utils/exchangeRate');

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
         authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImExNjRlZWYzLWY5OTAtNDMwNC04NWRiLTQwZTc1OGE2MDZhMyIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcyMDI1MDExNCwiaWF0IjoxNzIwMTYzNzE0LCJqdGkiOiJQU1dvRGtrNHpOZ0ppNTc2dFVVUWNiRlZCRlliZEUwcVFmdGsifQ.hfhuUHTXqXLrOGUgUdEGEnYlbySwLyVnaaR00l1kEksn7dtbZVKmOMAdOAtVHvEakf0mTqwlVKuXe8WA-RWijQ',
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
         authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImExNjRlZWYzLWY5OTAtNDMwNC04NWRiLTQwZTc1OGE2MDZhMyIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcyMDI1MDExNCwiaWF0IjoxNzIwMTYzNzE0LCJqdGkiOiJQU1dvRGtrNHpOZ0ppNTc2dFVVUWNiRlZCRlliZEUwcVFmdGsifQ.hfhuUHTXqXLrOGUgUdEGEnYlbySwLyVnaaR00l1kEksn7dtbZVKmOMAdOAtVHvEakf0mTqwlVKuXe8WA-RWijQ',
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
