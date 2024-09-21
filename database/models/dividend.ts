import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'dividend',
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
         dividend_date: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         currency: {
            type: DataTypes.ENUM('krw', 'usd'), // 입금, 출금
            allowNull: false,
         },
         amount: {
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
