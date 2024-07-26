const db = require('../../database/index');
const sequelize = require('sequelize');

const exchangeRate = db.exchangeRate;

async function createExchangeRate(rate: string) {
   await exchangeRate.create({ rate: rate });
}

async function updateExchangeRate(rate: string) {
   await exchangeRate.update({ rate: rate }, { where: { id: 1 } });
}

module.exports = { createExchangeRate, updateExchangeRate };
