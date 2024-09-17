const db = require('../../database/index');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const searchFrequency = db.searchFrequency;
const stock = db.stock;

async function readStockByName(searchWord: string) {
   const data = await stock.findOne({
      where: {
         [Op.or]: [{ stock_code: searchWord }, { stock_name_kr: searchWord }, { stock_name_en: searchWord }],
      },
      raw: true,
   });
   return data;
}

async function readStockByCode(stockCode: string) {
   const data = await stock.findOne({
      where: {
         stock_code: stockCode,
      },
      raw: true,
   });
   return data;
}

async function readStockById(stockId: number) {
   const data = await stock.findOne({
      where: {
         id: stockId,
      },
      raw: true,
   });
   return data;
}

module.exports = { readStockByName, readStockByCode, readStockById };
