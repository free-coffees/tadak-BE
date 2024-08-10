import { add } from 'cheerio/lib/api/traversing';
import express, { Request, Response } from 'express';

require('dotenv').config();
const routes = require('./src/routes/index');
const app = express();
const db = require('./database/index');
const http = require('http');
const morgan = require('morgan');
const schedule = require('node-schedule');
const getExchangeRateByCrawling = require('./src/utils/exchangeRate');
const getApiToken = require('./src/utils/getApiToken');
const updateRedisPrice = require('./src/utils/updateRedisPrice');
const { swaggerUi, swaggerSpec } = require('./swaggers/swagger');

const addIndexToDB = require('./src/utils/addIndexToDB');

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

//getApiToken();

//addIndexToDB();

// set port, listen for requests
const PORT = process.env.PORT || 10010;
server.listen(PORT, () => {
   console.log(`Server is running on Port ${PORT}!`);
   schedule.scheduleJob('0 0/20 * * * *', async function () {
      console.log('update exchange');
      await getExchangeRateByCrawling(); // 20분 마다 환율 업데이트 => 20분 마다는 redis에 저장하고 하루에 한번 종가 db에 저장할 예정
   });
   schedule.scheduleJob('0 0 0/23 * * *', async function () {
      console.log('get api token');
      await getApiToken(); // 23시간 마다 open api token 재발급
   });
   schedule.scheduleJob('0 0/1 * * * *', async function () {
      console.log('update redis price');
      await updateRedisPrice(); // 1분마다 redis 에 있는 가격 정보 업데이트
   });
   schedule.scheduleJob('0 1 5 * * *', async function () {
      console.log('update nasdaq, s&p500 index of close price'); // 매일 05:01 에 나스닥, s&p500 지수 종가 업데이트
   });
   schedule.scheduleJob('0 31 15 * * *', async function () {
      console.log('update kospi index of close price'); // 매일 15:31 에 코스피 지수 종가 업데이트
   });
});
module.exports = server;
