import { Sequelize } from 'sequelize';
var exchangeRateModel = require('./exchage_rate');

function initModels(sequelize: Sequelize) {
   var exchangeRate = exchangeRateModel(sequelize);

   return {
      exchangeRate,
   };
}
module.exports = initModels;
