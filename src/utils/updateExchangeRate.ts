import axios from 'axios';
const cheerio = require('cheerio');
const exchangeRateRepo = require('../repositories/exchangeRateRepository');

async function updateExchangeRate() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/USD-KRW?hl=ko');
      const $ = cheerio.load(html.data);
      const exchangeRate: string = $('div.YMlKec.fxKbKc').text();
      let rate = exchangeRate.slice(0, 9);
      rate = rate.replace(/,/g, '');
      let rateNum = parseFloat(rate);
      await exchangeRateRepo.createExchangeRate(rateNum);
   } catch (error) {
      console.error('Update Exchange Rate Error : ', error);
   }
}

module.exports = updateExchangeRate;
