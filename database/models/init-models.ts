import { Sequelize } from 'sequelize';
var exchangeRateModel = require('./exchage_rate');
var stockModel = require('./stock');
var searchFrequencyModel = require('./search_frequency');
var apiTokenModel = require('./api_token');
var userModel = require('./user');
var idxSP500Model = require('./index_sp500');
var idxKospiModel = require('./index_kospi');
var idxNasdaqModel = require('./index_nasdaq');

function initModels(sequelize: Sequelize) {
   var user = userModel(sequelize);
   var exchangeRate = exchangeRateModel(sequelize);
   var stock = stockModel(sequelize);
   var searchFrequency = searchFrequencyModel(sequelize);
   var apiToken = apiTokenModel(sequelize);
   var idxSP500 = idxSP500Model(sequelize);
   var idxKospi = idxKospiModel(sequelize);
   var idxNasdaq = idxNasdaqModel(sequelize);

   stock.hasOne(searchFrequency, { foreignKey: 'stock_id' });
   searchFrequency.belongsTo(stock, { foreignKey: 'stock_id' });

   return {
      user,
      exchangeRate,
      stock,
      searchFrequency,
      apiToken,
      idxSP500,
      idxKospi,
      idxNasdaq,
   };
}
module.exports = initModels;
