import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

import * as MESSAGE_EVENTS from "./message";
import * as BEDSPACE_EVENTS from "./bedSpace";

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
};

const pubsub = new RedisPubSub({
  
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
  BEDSPACE: BEDSPACE_EVENTS,
};

export default pubsub;
