import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'transaction',
      {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         stock_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         transaction_type: {
            type: DataTypes.ENUM('buy', 'sell'), // 매수, 매도
            allowNull: false,
         },
         quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         price: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
         },
         currency: {
            type: DataTypes.ENUM('krw', 'usd'),
            allowNull: false,
         },
         total_amount: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
         },
      },
      {
         paranoid: true,
         deletedAt: 'deletedAt',
         timestamps: true,
         freezeTableName: true,
         charset: 'utf8mb4',
      },
   );
};
