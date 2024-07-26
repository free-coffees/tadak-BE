import axios from 'axios';
const cheerio = require('cheerio');
const exchageRateRepo = require('../repositories/exchangeRateRepository');

async function getExchangeRateByCrawling() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/USD-KRW?hl=ko');
      const $ = cheerio.load(html.data);
      const exchangeRate: string = $('div.YMlKec.fxKbKc').text();
      await exchageRateRepo.updateExchangeRate(exchangeRate);
   } catch (error) {
      console.log(error);
   }
}

module.exports = getExchangeRateByCrawling;
