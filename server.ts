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

// simple route
app.get('/', (req: Request, res: Response) => {
   res.json({ message: 'Welcome to my application.' });
});

app.use(routes);

const server = http.createServer(app);

//getApiToken();

// set port, listen for requests
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
   console.log(`Server is running on Port ${PORT}!`);
   schedule.scheduleJob('0 0/20 * * * *', async function () {
      console.log('update exchange');
      await getExchangeRateByCrawling(); // 20분 마다 환율 업데이트
   });
   schedule.scheduleJob('0 0 0/23 * * *', async function () {
      console.log('get api token');
      await getApiToken(); // 23시간 마다 open api token 재발급
   });
   // schedule.scheduleJob('0 0/1 * * * *', async function () {
   //    console.log('update redis price');
   //    await updateRedisPrice(); // 23시간 마다 open api token 재발급
   // });
});
module.exports = server;
