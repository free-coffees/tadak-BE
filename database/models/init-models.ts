import { Sequelize } from 'sequelize';
var exchangeRateModel = require('./exchage_rate');
var stockModel = require('./stock');

function initModels(sequelize: Sequelize) {
   var exchangeRate = exchangeRateModel(sequelize);
   var stock = stockModel(sequelize);

   return {
      exchangeRate,
      stock,
   };
}
module.exports = initModels;
