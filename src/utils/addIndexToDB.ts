import xlsx from 'node-xlsx';
import fs from 'fs';
const db = require('../../database/index');
const idxKospi = db.idxKospi;
const idxNasdaq = db.idxNasdaq;
const idxSP500 = db.idxSP500;

async function addIndexToDB() {
   try {
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/idx.xlsx`));
      for (let i = 5; i < content[0].data.length; i++) {
         const data = content[0].data[i];
         let date = data[0];
         date = date.replace(/\. /g, '/');
         let ndate = date.split(' ')[0];
         ndate = new Date(ndate);
         ndate.setHours(16);
         const sp500 = data[2];
         const nasdaq = data[4];
         const kospi = data[8];
         console.log(ndate);
         await idxNasdaq.create({
            price: nasdaq,
            createdAt: ndate,
         });

         await idxSP500.create({
            price: sp500,
            createdAt: ndate,
         });

         ndate.setMinutes(-30);

         await idxKospi.create({
            price: kospi,
            createdAt: ndate,
         });
      }
      console.log('끝!!');
   } catch (error) {
      console.log(error);
   }
}

module.exports = addIndexToDB;
