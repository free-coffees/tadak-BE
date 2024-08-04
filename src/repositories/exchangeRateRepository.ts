const db = require('../../database/index');
const sequelize = require('sequelize');

const exchangeRate = db.exchangeRate;

async function createExchangeRate(rate: number) {
   await exchangeRate.create({ rate: rate });
}

async function readExchangeRateByDate() {
   const data = await exchangeRate.findOne({
      order: [['createdAt', 'DESC']],
      raw: true,
   });
   const createdAt = data.createdAt;
   const now = new Date();

   if (
      createdAt.getFullYear() == now.getFullYear() &&
      createdAt.getMonth() == now.getMonth() &&
      createdAt.getDate() == now.getDate()
   ) {
      return data;
   } else {
      return;
   }
}

async function updateExchangeRate(exchangeRateId: number, rate: number) {
   await exchangeRate.update({ rate: rate }, { where: { id: exchangeRateId } });
}

module.exports = { createExchangeRate, readExchangeRateByDate, updateExchangeRate };
