import { Sequelize } from 'sequelize';
import ApiError from '../../src/errorCustom/apiError';
var exchangeRateModel = require('./exchange_rate');
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
   const trans = transactionModel(sequelize);
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
   account.hasMany(trans, { foreignKey: 'account_id' });
   trans.belongsTo(account, { foreignKey: 'account_id' });
   stock.hasMany(trans, { foreignKey: 'stock_id' });
   trans.belongsTo(stock, { foreignKey: 'stock_id' });
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

   account.addHook('beforeBulkDestroy', async (options: any) => {
      const transaction = options.transaction;
      try {
         await holding.destroy({ where: { account_id: options.where.id }, transaction });
         await balance.destroy({ where: { account_id: options.where.id }, transaction });
         await dividend.destroy({ where: { account_id: options.where.id }, transaction });
         await trans.destroy({ where: { account_id: options.where.id }, transaction });
         await exchange.destroy({ where: { account_id: options.where.id }, transaction });
         await transfer.destroy({ where: { account_id: options.where.id }, transaction });
      } catch (error) {
         console.error('Transaction failed at account.addHook:', error);
         throw new ApiError(500, '관련 데이터를 삭제 중 오류가 발생했습니다.');
      }
   });

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
      trans,
      holding,
      dividend,
      securitiesCompany,
   };
}
module.exports = initModels;
