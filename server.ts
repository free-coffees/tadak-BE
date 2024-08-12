import express, { Request, Response } from 'express';

require('dotenv').config();
const routes = require('./src/routes/index');
const app = express();
const db = require('./database/index');
const http = require('http');
const morgan = require('morgan');
const schedule = require('node-schedule');
const updateRedisApiToken = require('./src/utils/updateRedisApiToken');
const updateRedisPrice = require('./src/utils/updateRedisPrice');
const updateRedisExchangeRate = require('./src/utils/updateRedisExchangeRate');
const updateExchangeRate = require('./src/utils/updateExchangeRate');
const { updateIndexSp500, updateIndexNasdaq } = require('./src/utils/updateIndexUS');
const updateIndexKospi = require('./src/utils/updateIndexKospi');
const { swaggerUi, swaggerSpec } = require('./swaggers/swagger');

const addIndexToDB = require('./src/utils/addIndexToDB');
const addExchangeRateToDB = require('./src/utils/addExchangeRateToDB');

db.sequelize
   .sync({ alter: true })
   .then(() => {
      console.log('db 연결 성공');
   })
   .catch(console.error);

const redisClient = require('./database/redis');
redisClient.connect().then();

app.use(morgan('dev'));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = http.createServer(app);

//addExchangeRateToDB();
//updateRedisApiToken();
//addIndexToDB();

// set port, listen for requests
const PORT = process.env.PORT || 10010;
server.listen(PORT, () => {
   console.log(`Server is running on Port ${PORT}!`);
   schedule.scheduleJob('*/20 * * * *', async function () {
      console.log('update exchange');
      await updateRedisExchangeRate(); // 20분 마다 환율 업데이트 => 20분 마다는 redis에 저장하고 하루에 한번 종가 db에 저장할 예정
   });
   schedule.scheduleJob('59 23 * * *', async function () {
      console.log('update today exchange'); // 매일 23:59 에 당일 환율 db에 저장
      await updateExchangeRate();
   });
   schedule.scheduleJob('0 */8 * * *', async function () {
      console.log('get api token');
      await updateRedisApiToken(); // 8시간 마다 open api token 재발급
   });
   schedule.scheduleJob('*/1 * * * *', async function () {
      console.log('update redis price');
      await updateRedisPrice(); // 1분마다 redis 에 있는 가격 정보 업데이트
   });
   schedule.scheduleJob('1 5 * * *', async function () {
      console.log('update today nasdaq, s&p500 index of close price'); // 매일 05:01 에 나스닥, s&p500 지수 종가 업데이트
      await updateIndexSp500();
      await updateIndexNasdaq();
   });
   schedule.scheduleJob('31 15 * * *', async function () {
      console.log('update today kospi index of close price'); // 매일 15:31 에 코스피 지수 종가 업데이트
      await updateIndexKospi();
   });
});
module.exports = server;
