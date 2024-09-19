const db = require('../../database/index');
const sequelize = require('sequelize');

const exchangeRate = db.exchangeRate;

async function createExchangeRate(rate: number) {
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   today.setDate(today.getDate() - 1);
   await exchangeRate.create({ rate: rate, date: today });
}

async function readRecentExchangeRate() {
   const data = await exchangeRate.findOne({
      order: [['date', 'DESC']],
      raw: true,
   });
   return data.rate;
}

async function updateExchangeRate(exchangeRateId: number, rate: number) {
   await exchangeRate.update({ rate: rate }, { where: { id: exchangeRateId } });
}

module.exports = { createExchangeRate, readRecentExchangeRate, updateExchangeRate };
