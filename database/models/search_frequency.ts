import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'search_frequency',
      {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         stock_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         frequency: {
            type: DataTypes.INTEGER,
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
