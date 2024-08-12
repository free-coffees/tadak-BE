import axios from 'axios';
const cheerio = require('cheerio');
const db = require('../../database/index');
const index_nasdaq = db.idxNasdaq;
const index_sp500 = db.idxSP500;

async function updateIndexSp500() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/.INX:INDEXSP?hl=ko');
      const $ = cheerio.load(html.data);
      let price: string = $('div.YMlKec.fxKbKc').text();
      price = price.replace(/,/g, '');
      let priceNum = parseFloat(price);
      let today = new Date();
      today.setHours(today.getHours() - 13);
      today.setHours(16, 0, 0, 0);
      await index_sp500.create({
         date: today,
         price: priceNum,
      });
   } catch (error) {
      console.log(error);
   }
}

async function updateIndexNasdaq() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/.IXIC:INDEXNASDAQ?hl=ko');
      const $ = cheerio.load(html.data);
      let price: string = $('div.YMlKec.fxKbKc').text();
      price = price.replace(/,/g, '');
      let priceNum = parseFloat(price);
      let today = new Date();
      today.setHours(today.getHours() - 13);
      today.setHours(16, 0, 0, 0);
      await index_nasdaq.create({
         date: today,
         price: priceNum,
      });
   } catch (error) {
      console.log(error);
   }
}

module.exports = { updateIndexSp500, updateIndexNasdaq };
