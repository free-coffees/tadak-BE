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

         await exchangeRate.create({
            rate: rate,
            date: ndate,
            createdAt: ndate,
         });
      }
      console.log('끝!!');
   } catch (error) {
      console.log(error);
   }
}

async function updateExchangeRateAtDB() {
   try {
      const list = await exchangeRate.findAll({ raw: true });
      //console.log(list);
      let prev = list[0];
      for (let i = 1; i < list.length; i++) {
         let now = list[i];
         let temp = now.date.getDate() - prev.date.getDate();
         let temp2 = prev.rate;
         console.log(prev, now);
         console.log(temp);
         while (temp > 1) {
            prev.date = new Date(prev.date.setDate(prev.date.getDate() + 1));
            await exchangeRate.create({
               date: prev.date,
               rate: temp2,
               createdAt: prev.date,
               updatedAt: prev.date,
            });
            console.log(prev.date);
            temp--;
         }
         prev = now;
      }
   } catch (error) {
      console.log(error);
   }
}

module.exports = { addExchangeRateToDB, updateExchangeRateAtDB };
