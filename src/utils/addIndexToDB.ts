import xlsx from 'node-xlsx';
import fs from 'fs';
const db = require('../../database/index');
const idxKospi = db.idxKospi;
const idxNasdaq = db.idxNasdaq;
const idxSP500 = db.idxSP500;

async function addIndexToDB() {
   try {
      console.time('전체');
      const content = xlsx.parse(fs.readFileSync(`${__dirname}/index.xlsx`));
      const promises = [];
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
         let ndate2 = ndate;
         ndate2.setMinutes(-30);
         promises.push(
            idxNasdaq.create({
               price: nasdaq,
               date: ndate,
               createdAt: ndate,
               updatedAt: ndate,
            }),
            idxSP500.create({
               price: sp500,
               date: ndate,
               createdAt: ndate,
               updatedAt: ndate,
            }),
            idxKospi.create({
               price: kospi,
               date: ndate,
               createdAt: ndate2,
               updatedAt: ndate2,
            }),
         );
         await Promise.all(promises);
      }
      console.timeEnd('전체');
      console.log('끝!!');
   } catch (error) {
      console.log(error);
   }
}

module.exports = addIndexToDB;
