import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'deposit_withdrawl',
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
         transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         transaction_type: {
            type: DataTypes.ENUM('DEPOSIT', 'WITHDRAWL'), // 입금, 출금
            allowNull: false,
         },
         amount: {
            type: DataTypes.DECIMAL(18, 0),
            allowNull: false,
         },
      },
      {
         timestamps: true,
         freezeTableName: true,
         charset: 'utf8mb4',
      },
   );
};
