import axios from 'axios';
const cheerio = require('cheerio');

async function getExchangeRateByCrawling() {
   try {
      let html = await axios.get('https://www.google.com/finance/quote/USD-KRW?hl=ko');
      const $ = cheerio.load(html.data);
      const exchageRate = $('div.YMlKec.fxKbKc').text();
      console.log(exchageRate);
   } catch (error) {
      console.log(error);
   }
}

module.exports = getExchangeRateByCrawling;
