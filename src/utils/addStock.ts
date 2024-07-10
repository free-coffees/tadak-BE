import xlsx from 'node-xlsx';
import fs from 'fs';
import axios from 'axios';
const db = require('../../database/index');
const stock = db.stock;

const access_token =
   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjllMzg0M2FiLTU2MGUtNDAxOS05YmEzLTFmMWU1YTc5NzFhNSIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcyMDY3ODQzOCwiaWF0IjoxNzIwNTkyMDM4LCJqdGkiOiJQU1dvRGtrNHpOZ0ppNTc2dFVVUWNiRlZCRlliZEUwcVFmdGsifQ.WHLuWumhjilqv09tsQDnBQ0e4N7HAsB5RwZrk2-Y-bu0OxodDHhcFXL-jmUrCrtRZ1J5p3dTweT3tfKMP-okjQ';
function sleep(ms: any) {
   return new Promise(r => setTimeout(r, ms));
}
async function addNasdaqStockToDB() {
   try {
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/nasdaq.xlsx`));
      for (let i = 3605; i < content[0].data.length; i++) {
         await sleep(100);
         if (content[0].data[i][0].includes('^')) {
            content[0].data[i][0] = content[0].data[i][0].replace('^', '/');
         }
         const data = await axios({
            method: 'GET',
            url: 'https://openapi.koreainvestment.com:9443/uapi/overseas-price/v1/quotations/search-info',
            headers: {
               'Content-Type': 'application/json; charset=UTF-8',
               authorization: 'Bearer ' + access_token,
               appkey: process.env.STOCK_KEY,
               appsecret: process.env.STOCK_SECRET_KEY,
               tr_id: 'CTPF1702R',
               custtype: 'P',
            },
            params: {
               PRDT_TYPE_CD: '512',
               PDNO: content[0].data[i][0],
            },
         });
         if (data.data.output) {
            await stock.create({
               stock_code: content[0].data[i][0],
               stock_name_kr: data.data.output.prdt_name,
               stock_name_en: data.data.output.prdt_eng_name,
               market: 'nasdaq',
            });
         } else {
            console.log(data.data);
            console.log(content[0].data[i][0]);
         }
      }
      console.log('끝!!');
   } catch (error) {
      console.log(error);
   }
}

async function addNyseStockToDB() {
   try {
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/nyse.xlsx`));
      for (let i = 1; i < content[0].data.length; i++) {
         await sleep(100);
         if (content[0].data[i][0].includes('^')) {
            content[0].data[i][0] = content[0].data[i][0].replace('^', '/');
         }
         const data = await axios({
            method: 'GET',
            url: 'https://openapi.koreainvestment.com:9443/uapi/overseas-price/v1/quotations/search-info',
            headers: {
               'Content-Type': 'application/json; charset=UTF-8',
               authorization: 'Bearer ' + access_token,
               appkey: process.env.STOCK_KEY,
               appsecret: process.env.STOCK_SECRET_KEY,
               tr_id: 'CTPF1702R',
               custtype: 'P',
            },
            params: {
               PRDT_TYPE_CD: '513',
               PDNO: content[0].data[i][0],
            },
         });
         if (data.data.output) {
            await stock.create({
               stock_code: content[0].data[i][0],
               stock_name_kr: data.data.output.prdt_name,
               stock_name_en: data.data.output.prdt_eng_name,
               market: 'nyse',
            });
         } else {
            console.log(data.data);
            console.log(content[0].data[i][0]);
         }
      }
      console.log('끝!!');
   } catch (error) {
      //console.log(error);
   }
}

async function addAmexStockToDB() {
   try {
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/amex.xlsx`));
      for (let i = 1; i < content[0].data.length; i++) {
         await sleep(100);
         if (content[0].data[i][0].includes('^')) {
            content[0].data[i][0] = content[0].data[i][0].replace('^', '/');
         }
         const data = await axios({
            method: 'GET',
            url: 'https://openapi.koreainvestment.com:9443/uapi/overseas-price/v1/quotations/search-info',
            headers: {
               'Content-Type': 'application/json; charset=UTF-8',
               authorization: 'Bearer ' + access_token,
               appkey: process.env.STOCK_KEY,
               appsecret: process.env.STOCK_SECRET_KEY,
               tr_id: 'CTPF1702R',
               custtype: 'P',
            },
            params: {
               PRDT_TYPE_CD: '529',
               PDNO: content[0].data[i][0],
            },
         });
         if (data.data.output) {
            await stock.create({
               stock_code: content[0].data[i][0],
               stock_name_kr: data.data.output.prdt_name,
               stock_name_en: data.data.output.prdt_eng_name,
               market: 'amex',
            });
         } else {
            console.log(data.data);
            console.log(content[0].data[i][0]);
         }
      }
      console.log('끝!!');
   } catch (error) {
      //console.log(error);
   }
}

async function addKrStockToDB() {
   try {
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/krstock.xlsx`));
      for (let i = 1; i < content[0].data.length; i++) {
         await sleep(100);
         const data = await axios({
            method: 'GET',
            url: 'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/search-info',
            headers: {
               'Content-Type': 'application/json; charset=UTF-8',
               authorization: 'Bearer ' + access_token,
               appkey: process.env.STOCK_KEY,
               appsecret: process.env.STOCK_SECRET_KEY,
               tr_id: 'CTPF1604R',
               custtype: 'P',
            },
            params: {
               PRDT_TYPE_CD: '300',
               PDNO: content[0].data[i][0],
            },
         });
         if (data.data.output) {
            await stock.create({
               stock_code: content[0].data[i][0],
               stock_name_kr: data.data.output.prdt_name,
               stock_name_en: data.data.output.prdt_eng_name,
               market: content[0].data[i][2],
            });
         } else {
            console.log(data.data);
            console.log(content[0].data[i][0]);
         }
      }
      console.log('끝!!');
   } catch (error) {
      //console.log(error);
   }
}

module.exports = {
   addNasdaqStockToDB,
   addNyseStockToDB,
   addAmexStockToDB,
   addKrStockToDB,
};
