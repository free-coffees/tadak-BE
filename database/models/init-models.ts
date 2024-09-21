import { Sequelize } from 'sequelize';
var exchangeRateModel = require('./exchage_rate');
var stockModel = require('./stock');
var searchFrequencyModel = require('./search_frequency');
var userModel = require('./user');
var accountModel = require('./account');
var balanceModel = require('./balance');
var transferModel = require('./transfer');
var exchangeModel = require('./exchange');
var transactionModel = require('./transaction');
var holdingModel = require('./holding');
var dividendModel = require('./dividend');
var idxSP500Model = require('./index_sp500');
var idxKospiModel = require('./index_kospi');
var idxNasdaqModel = require('./index_nasdaq');
var securitiesCompanyModel = require('./securities_company');

function initModels(sequelize: Sequelize) {
   const exchangeRate = exchangeRateModel(sequelize);
   const stock = stockModel(sequelize);
   const searchFrequency = searchFrequencyModel(sequelize);
   const user = userModel(sequelize);
   const account = accountModel(sequelize);
   const balance = balanceModel(sequelize);
   const transfer = transferModel(sequelize);
   const exchange = exchangeModel(sequelize);
   const transaction = transactionModel(sequelize);
   const holding = holdingModel(sequelize);
   const dividend = dividendModel(sequelize);
   const idxSP500 = idxSP500Model(sequelize);
   const idxKospi = idxKospiModel(sequelize);
   const idxNasdaq = idxNasdaqModel(sequelize);
   const securitiesCompany = securitiesCompanyModel(sequelize);

   user.hasMany(account, { foreignKey: 'user_id' });
   account.belongsTo(user, { foreignKey: 'user_id' });
   account.hasMany(transfer, { foreignKey: 'account_id' });
   transfer.belongsTo(account, { foreignKey: 'account_id' });
   account.hasMany(exchange, { foreignKey: 'account_id' });
   exchange.belongsTo(account, { foreignKey: 'account_id' });
   account.hasMany(balance, { foreignKey: 'account_id' });
   balance.belongsTo(account, { foreignKey: 'account_id' });
   account.hasMany(transaction, { foreignKey: 'account_id' });
   transaction.belongsTo(account, { foreignKey: 'account_id' });
   stock.hasMany(transaction, { foreignKey: 'stock_id' });
   transaction.belongsTo(stock, { foreignKey: 'stock_id' });
   account.hasMany(dividend, { foreignKey: 'account_id' });
   dividend.belongsTo(account, { foreignKey: 'account_id' });
   stock.hasMany(dividend, { foreignKey: 'stock_id' });
   dividend.belongsTo(stock, { foreignKey: 'stock_id' });
   account.hasMany(holding, { foreignKey: 'account_id' });
   holding.belongsTo(account, { foreignKey: 'account_id' });
   stock.hasMany(holding, { foreignKey: 'stock_id' });
   holding.belongsTo(stock, { foreignKey: 'stock_id' });
   stock.hasOne(searchFrequency, { foreignKey: 'stock_id' });
   searchFrequency.belongsTo(stock, { foreignKey: 'stock_id' });
   securitiesCompany.hasMany(account, { foreignKey: 'securities_company_id' });
   account.belongsTo(securitiesCompany, { foreignKey: 'securities_company_id' });

   return {
      user,
      exchangeRate,
      stock,
      searchFrequency,
      idxSP500,
      idxKospi,
      idxNasdaq,
      transfer,
      account,
      balance,
      exchange,
      transaction,
      holding,
      dividend,
      securitiesCompany,
   };
}
module.exports = initModels;
