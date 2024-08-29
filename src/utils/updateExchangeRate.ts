import axios from 'axios';
const cheerio = require('cheerio');
const exchageRateRepo = require('../repositories/exchangeRateRepository');

async function updateExchangeRate() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/USD-KRW?hl=ko');
      const $ = cheerio.load(html.data);
      const exchangeRate: string = $('div.YMlKec.fxKbKc').text();
      let rate = exchangeRate.slice(0, 9);
      rate = rate.replace(/,/g, '');
      let rateNum = parseFloat(rate);
      await exchageRateRepo.createExchangeRate(rateNum);
   } catch (error) {
      console.log(error);
   }
}

module.exports = updateExchangeRate;
