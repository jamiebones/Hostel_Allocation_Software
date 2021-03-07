import slowConnection from "./slow";
import fastConnection from "./fast";

export default {
  slowConn: slowConnection(),
  fastConn: fastConnection(),
};
