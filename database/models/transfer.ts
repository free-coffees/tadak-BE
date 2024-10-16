import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'transfer',
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
         transfer_date: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         transfer_type: {
            type: DataTypes.ENUM('deposit', 'withdrawal'), // 입금, 출금
            allowNull: false,
         },
         amount: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
         },
         currency: {
            type: DataTypes.ENUM('krw', 'usd'),
            allowNull: false,
         },
         transfer_name: {
            type: DataTypes.STRING,
            allowNull: true,
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
