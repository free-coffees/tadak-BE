import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
   return sequelize.define(
      'user',
      {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         nickname: {
            type: DataTypes.STRING,
         },
         device_id: {
            type: DataTypes.STRING,
         },
         social_id: {
            type: DataTypes.STRING,
         },
         refresh_token: {
            type: DataTypes.STRING(1234),
         },
         membership_level: {
            type: DataTypes.ENUM('1', '2'), //1: 기본, 2: 리뷰작성시 등록가능한 종목 10개 이상으로 가능
            defaultValue: '1',
            allowNull: false,
         },
         social: {
            type: DataTypes.ENUM('none', 'kakao', 'apple'), //1: none, 2: kakao, 3: apple
            defaultValue: 'none',
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
