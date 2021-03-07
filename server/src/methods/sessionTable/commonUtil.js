import config from "../../config/";
import models from "../../models";

export const getActiveSession = async () => {
  let activeSession = await config.redisClient.getAsync("activeSession");
  if (activeSession) {
    let sessionToReturn = JSON.parse(activeSession);
    return sessionToReturn;
  }
  //not stored in cache we can as well get the session from the cache
  const session = await models.SessionTable.findOne({ active: true });
  return session;
};
