import express, { Request, Response } from 'express';

require('dotenv').config();
const routes = require('./src/routes/index');
const app = express();
//const db = require("./database/index");
const http = require('http');
const morgan = require('morgan');
const schedule = require('node-schedule');
const getExchangeRate = require('./src/utils/exchangeRate');

// db.sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("db 연결 성공");
//   })
//   .catch(console.error);
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

// set port, listen for requests
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
   console.log(`Server is running on Port ${PORT}!`);
   schedule.scheduleJob('*/1 * * * *', function () {
      getExchangeRate();
   });
});
module.exports = server;
