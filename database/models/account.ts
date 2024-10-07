import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'account',
      {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         account_name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         securities_company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         is_started: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N',
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
