import models from "../models";
import mongoose from "mongoose";

export default async () => {
  const {
    DB_DATABASE,
    DB_PASSWORD,
    replicaSetOne,
    replicaSetTwo,
    replicaSetThree,
  } = process.env;

  //url = `mongodb://mongo1:27017,mongo2:27018,mongo3:27019/${DB_DATABASE}`;

  let url;
  url = `mongodb://admin:${DB_PASSWORD}@${replicaSetOne},${replicaSetTwo},${replicaSetThree}/${DB_DATABASE}`;
  // mongodb://<HOSTNAME>:27017,<HOSTNAME>:27018,<HOSTNAME>:27019/<DBNAME>
  if (process.env.NODE_ENV === "production") {
    url = `mongodb://admin:${DB_PASSWORD}@${replicaSetOne},${replicaSetTwo},${replicaSetThree}/${DB_DATABASE}`;
  }
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
  return models(conn);
};
