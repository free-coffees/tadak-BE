const db = require('../../database/index');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const searchFrequency = db.searchFrequency;
const stock = db.stock;

async function createSearchFrequency(stockId: number) {
   await searchFrequency.create({
      stock_id: stockId,
      frequency: 1,
   });
}

async function readSearchList(searchWord: string) {
   const data = await stock.findAll({
      attributes: [
         ['id', 'stock_id'],
         'stock_code',
         'stock_name_kr',
         'stock_name_en',
         'market',
         [sequelize.col('search_frequency.frequency'), 'frequency'],
      ],
      where: {
         [Op.or]: [
            { stock_code: { [Op.like]: '%' + searchWord + '%' } },
            { stock_name_kr: { [Op.like]: '%' + searchWord + '%' } },
            { stock_name_en: { [Op.like]: '%' + searchWord + '%' } },
         ],
      },
      include: [
         {
            model: searchFrequency,
            as: 'search_frequency',
            attributes: [],
         },
      ],
      order: [['frequency', 'DESC']],
      raw: true,
   });

   return data;
}

async function readSearchFrequency(stockId: number) {
   const data = await searchFrequency.findOne({
      where: {
         stock_id: stockId,
      },
   });
   return data;
}

async function updateSearchFrequency(stockId: number) {
   await searchFrequency.increment(
      { frequency: 1 },
      {
         where: {
            stock_id: stockId,
         },
      },
   );
}

module.exports = { readSearchList, updateSearchFrequency, readSearchFrequency, createSearchFrequency };
