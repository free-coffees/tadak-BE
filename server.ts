import express from 'express';

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

const { swaggerSpec, swaggerUi } = require('./swaggers/swagger');

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

// set port, listen for requests
const PORT = process.env.PORT || 10010;
server.listen(PORT, () => {
   console.log(`Server is running on Port ${PORT}!`);
   schedule.scheduleJob('*/30 * * * *', async function () {
      await updateRedisExchangeRate(); // 30분 마다 환율 업데이트
      console.log('update exchange');
   });
   schedule.scheduleJob('1 0 * * *', async function () {
      await updateExchangeRate(); // 매일 00:01 에 그 전날 환율 db에 저장
      console.log('update today close exchange');
   });
   schedule.scheduleJob('0 */8 * * *', async function () {
      await updateRedisApiToken(); // 8시간 마다 open api token 재발급
      console.log('get api token');
   });
   schedule.scheduleJob('*/1 * * * *', async function () {
      await updateRedisPrice(); // 1분마다 redis 에 있는 가격 정보 업데이트
   });
   schedule.scheduleJob('1 5 * * *', async function () {
      await updateIndexSp500();
      await updateIndexNasdaq();
      console.log('update today nasdaq, s&p500 index of close price'); // 매일 05:01 에 나스닥, s&p500 지수 종가 업데이트
   });
   schedule.scheduleJob('31 15 * * *', async function () {
      await updateIndexKospi();
      console.log('update today kospi index of close price'); // 매일 15:31 에 코스피 지수 종가 업데이트
   });
});
module.exports = server;
