import key from "./keys";
import logger from "./winston";
import redis from "./redis-client";
import isAuth from "./isAuth";
import createCollection from "./createCollection";
import checkAccessRight from "./checkAccessRight";

export default {
  ...key,
  winston: logger,
  redisClient: redis,
  isAuth,
  createCollection,
  checkAccessRight,
};
