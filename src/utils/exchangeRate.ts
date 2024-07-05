import axios from 'axios';

async function getExchangeRate() {
   try {
      const data = await axios({
         method: 'GET',
         url: 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON',
         params: {
            authkey: process.env.EXCHANGERATE_AUTH_KEY,
            data: 'AP01',
         },
      });
      console.log(data.data);
   } catch (error) {
      console.log(error);
   }
}

module.exports = getExchangeRate;
