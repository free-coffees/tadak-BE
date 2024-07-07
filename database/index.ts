const dbConfig = require('./db.confing');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'; // 지정된 환경변수가 없으면 'development'로 지정

// config/config.json 파일에 있는 설정값들을 불러온다.
// config객체의 env변수(development)키 의 객체값들을 불러온다.
// 즉, 데이터베이스 설정을 불러온다고 말할 수 있다.
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
   host: dbConfig.HOST,
   dialect: dbConfig.dialect,
   logging: false,

   pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
   },
   timezone: dbConfig.timezone,
});

const db = { sequelize: sequelize };
// 연결객체를 나중에 재사용하기 위해 db.sequelize에 넣어둔다.

// 모듈로 꺼낸다.
module.exports = db;
