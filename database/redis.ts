import { createClient } from 'redis';

const redisClient = createClient({
   url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
   socket: {
      reconnectStrategy(retries, cause) {
         if (retries > 20) {
            console.log('재시도 횟수 20회 초과');
            return new Error('Too many retries');
         } else {
            console.log('연결 재시도');
            return 500;
         }
      },
   },
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
