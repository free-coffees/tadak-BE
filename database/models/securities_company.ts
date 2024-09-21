import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'securities_company',
      {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         company_name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         logo_image_url: {
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
