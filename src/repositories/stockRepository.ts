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

module.exports = { readStockByName };
