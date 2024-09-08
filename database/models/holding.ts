import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'holding',
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
         quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         average_price: {
            type: DataTypes.DECIMAL(18, 4),
            allowNull: false,
         },
         status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
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
