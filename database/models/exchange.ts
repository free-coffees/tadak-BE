import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'exchange',
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
         exchange_date: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         from_currency: {
            type: DataTypes.ENUM('krw', 'usd'),
            allowNull: false,
         },
         to_currency: {
            type: DataTypes.ENUM('krw', 'usd'),
            allowNull: false,
         },
         exchange_rate: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
         },
         amount: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
         },
         exchanged_amount: {
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
