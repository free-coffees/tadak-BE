import { createClient } from 'redis';

const redisClient = createClient({
   url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
   //legacyMode: true,
});

redisClient.on('connect', function () {
   console.log('Redis Database connected');
});

redisClient.on('reconnecting', function () {
   console.log('Redis client reconnecting');
});

redisClient.on('ready', function () {
   console.log('Redis client is ready');
});
1;

redisClient.on('error', function (err) {
   console.log('Redis Error: ' + err);
});

redisClient.on('end', function () {
   console.log('\nRedis client disconnected');
   console.log('Server is going down now...');
   process.exit();
});

module.exports = redisClient;
