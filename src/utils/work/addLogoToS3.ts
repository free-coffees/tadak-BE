import fs from 'fs';
import axios from 'axios';
import xlsx from 'node-xlsx';
const aws = require('aws-sdk');
const db = require('../../../database/index');
const stock = db.stock;

async function addStandardCodeToDB() {
   try {
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/stock_kr.xlsx`));
      for (let i = 1; i < content[0].data.length; i++) {
         const stockCode = content[0].data[i][1];
         const standardCode = content[0].data[i][0];
         await stock.update(
            { standard_code: standardCode },
            {
               where: {
                  stock_code: stockCode,
               },
            },
         );
      }
   } catch (error) {
      console.log(error);
   }
}

function sleep(ms: any) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

async function getLogo() {
   const token = 'cra4mopr01qhc9u9ko9gcra4mopr01qhc9u9koa0';
   const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: 'ap-northeast-2',
   });

   try {
      const stockList = await stock.findAll({ raw: true });
      let data;
      let num = 0;
      for (let i = 7825; i < stockList.length; i++) {
         await sleep(1000);
         if (stockList[i].market == 'NYSE' || stockList[i].market == 'AMEX' || stockList[i].market == 'NASDAQ') {
            data = await axios({
               method: 'GET',
               url: 'https://finnhub.io/api/v1/stock/profile2',
               headers: {
                  'Content-Type': 'application/json; charset=UTF-8',
               },
               params: {
                  symbol: stockList[i].stock_code,
                  token: token,
               },
            });
         } else {
            data = await axios({
               method: 'GET',
               url: 'https://finnhub.io/api/v1/stock/profile2',
               headers: {
                  'Content-Type': 'application/json; charset=UTF-8',
                  Connection: 'close',
               },
               params: {
                  isin: stockList[i].standard_code,
                  token: token,
               },
            });
         }
         if (data.data.logo) {
            const response = await axios({
               url: data.data.logo,
               method: 'GET',
               responseType: 'stream',
            });
            const fileType = response.headers['content-type'].split('/')[1];
            const fileName = stockList[i].stock_code + '.' + fileType;
            const uploadParams = {
               Bucket: 'tadak-bucket',
               Key: 'logos/' + fileName,
               Body: response.data,
               ContentType: response.headers['content-type'],
            };
            if (fileType != 'octet-stream') {
               const result = await s3.upload(uploadParams).promise();
               await stock.update(
                  {
                     logo_image_url: 'https://tadak-bucket.s3.ap-northeast-2.amazonaws.com/logos/' + fileName,
                  },
                  {
                     where: { id: stockList[i].id },
                  },
               );
            }

            console.log(stockList[i].id, stockList[i].stock_code, fileName);
         }
      }
      console.log('끝!!');
   } catch (error: any) {
      console.log(error.response.data);
   }
}

module.exports = { getLogo };
