import { Sequelize } from 'sequelize';
var exchangeRateModel = require('./exchage_rate');
var stockModel = require('./stock');
var searchFrequencyModel = require('./search_frequency');
var apiTokenModel = require('./api_token');
var userModel = require('./user');

function initModels(sequelize: Sequelize) {
   var user = userModel(sequelize);
   var exchangeRate = exchangeRateModel(sequelize);
   var stock = stockModel(sequelize);
   var searchFrequency = searchFrequencyModel(sequelize);
   var apiToken = apiTokenModel(sequelize);

   stock.hasOne(searchFrequency, { foreignKey: 'stock_id' });
   searchFrequency.belongsTo(stock, { foreignKey: 'stock_id' });

   return {
      user,
      exchangeRate,
      stock,
      searchFrequency,
      apiToken,
   };
}
module.exports = initModels;
