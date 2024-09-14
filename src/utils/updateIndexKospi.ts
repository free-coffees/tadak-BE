import axios from 'axios';
const cheerio = require('cheerio');
const db = require('../../database/index');
const index_kospi = db.idxKospi;

async function updateIndexKospi() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/KOSPI:KRX?hl=ko');
      const $ = cheerio.load(html.data);
      let price: string = $('div.YMlKec.fxKbKc').text();

      price = price.replace(/,/g, '');
      let priceNum = parseFloat(price);
      let today = new Date();
      today.setHours(15, 30, 0, 0);
      await index_kospi.create({
         date: today,
         price: priceNum,
      });
   } catch (error) {
      console.error('Update Index Kospi Error : ', error);
   }
}

module.exports = updateIndexKospi;
