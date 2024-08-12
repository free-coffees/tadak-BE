import axios from 'axios';
const exchageRateRepo = require('../repositories/exchangeRateRepository');
const redisClient = require('../../database/redis');

async function updateExchangeRate() {
   try {
      let rate = await redisClient.get('exchange_rate');
      let rateNum = parseFloat(rate);
      await exchageRateRepo.createExchangeRate(rateNum);
   } catch (error) {
      console.log(error);
   }
}

module.exports = updateExchangeRate;
