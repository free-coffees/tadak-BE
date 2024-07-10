import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'stock',
      {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         stock_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
         },
         stock_name_kr: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         stock_name_en: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         market: {
            type: DataTypes.STRING,
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
