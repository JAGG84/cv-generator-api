import IORedis from 'ioredis';

const redis = new IORedis({ host: '127.0.0.1', port: 6379,  password: 'tu_password_redis', });

redis.info().then(info => {
  console.log(info.match(/redis_version:.*/)?.[0]);
  process.exit(0);
});
