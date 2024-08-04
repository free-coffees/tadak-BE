import xlsx from 'node-xlsx';
import fs from 'fs';
const db = require('../../database/index');
const exchangeRate = db.exchangeRate;

async function addExchangeRateToDB() {
   try {
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/exchange.xls`));
      for (let i = content[0].data.length - 1; i >= 2; i--) {
         let str = content[0].data[i][5];
         if (str[0] == 1) {
            str = str.slice(0, 8);
         } else {
            str = str.slice(0, 6);
         }
         str = str.replace(/,/g, '');
         let rate = parseFloat(str);
         let date = content[0].data[i][0];
         date = date.replace(/\./g, '/');
         let ndate = new Date(date);
         console.log(ndate);

         await exchangeRate.create({
            rate: rate,
            createdAt: ndate,
         });
         //    if (data.data.output) {
         //       await stock.create({
         //          stock_code: content[0].data[i][0],
         //          stock_name_kr: data.data.output.prdt_abrv_name,
         //          stock_name_en: data.data.output.prdt_eng_abrv_name,
         //          market: 'ETN',
         //       });
         //    } else {
         //       console.log(data.data);
         //       console.log(content[0].data[i][0]);
         //    }
      }
      console.log('끝!!');
   } catch (error) {
      console.log(error);
   }
}

module.exports = addExchangeRateToDB;
