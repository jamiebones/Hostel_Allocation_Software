// redis-client.js
// const redis = require("redis");
// const { promisify } = require("util");
// const client = redis.createClient(process.env.REDIS_URL);

// export default {
//   ...client,
//   getAsync: promisify(client.get).bind(client),
//   delAsync: promisify(client.del).bind(client),
//   setAsync: promisify(client.set).bind(client),
//   keysAsync: promisify(client.keys).bind(client),
//   hmsetAsync:promisify(client.hmset).bind(client),
//   hgetallAsync:promisify(client.hgetall).bind(client),
//   hdelAsync:promisify(client.hdel).bind(client),
// };
