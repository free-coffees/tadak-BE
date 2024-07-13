import { Sequelize } from 'sequelize';
var exchangeRateModel = require('./exchage_rate');
var stockModel = require('./stock');
var searchFrequencyModel = require('./search_frequency');

function initModels(sequelize: Sequelize) {
   var exchangeRate = exchangeRateModel(sequelize);
   var stock = stockModel(sequelize);
   var searchFrequency = searchFrequencyModel(sequelize);

   stock.hasOne(searchFrequency, { foreignKey: 'stock_id' });
   searchFrequency.belongsTo(stock, { foreignKey: 'stock_id' });

   return {
      exchangeRate,
      stock,
      searchFrequency,
   };
}
module.exports = initModels;
