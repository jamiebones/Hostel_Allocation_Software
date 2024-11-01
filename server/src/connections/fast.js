import models from "../models";
import mongoose from "mongoose";
import config from "../config";

let timesTried = 0;

export default async () => {
  const {
    DB_DATABASE,
    DB_PASSWORD,
    Replica_Set_One,
    Replica_Set_Two,
    Replica_Set_Three,
  } = config.config;

  //url = `mongodb://mongo1:27017,mongo2:27018,mongo3:27019/${DB_DATABASE}`;

  let url;
  url = `mongodb://admin:${DB_PASSWORD}@${Replica_Set_One},${Replica_Set_Two},${Replica_Set_Three}/${DB_DATABASE}`;
  // mongodb://<HOSTNAME>:27017,<HOSTNAME>:27018,<HOSTNAME>:27019/<DBNAME>
  console.log("the url:", url)
  if (process.env.NODE_ENV === "production") {
    url = `mongodb://admin:${DB_PASSWORD}@${Replica_Set_One},${Replica_Set_Two},${Replica_Set_Three}/${DB_DATABASE}`;
  }
  try {
    const conn = await runConnection(url);
    return models(conn);
  } catch (error) {
    while (timesTried < 3) {
      timesTried++;
      const conn = await runConnection(url);
      return models(conn);
    }
  }
};

const runConnection = async function (url) {
  const conn = await mongoose.createConnection(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true,
    authSource: "admin",
    poolSize: 10,
    replicaSet: "rs0",
  });
  return conn;
};
