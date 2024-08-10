import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'index_kospi',
      {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         date: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         price: {
            type: DataTypes.DECIMAL(7, 2),
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
