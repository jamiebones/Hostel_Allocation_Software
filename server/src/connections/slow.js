import models from "../models";
import mongoose from "mongoose";
import config from "../config";

export default async () => {
  const {
    DB_DATABASE,
    DB_PASSWORD,
    Replica_Set_One,
    Replica_Set_Two,
    Replica_Set_Three,
  } = config.config;

  const username = 'admin';
  const password = DB_PASSWORD;
  const replicaSetName = 'rs0';
  const dbName = DB_DATABASE;

  // Connection URI with replica set and authentication
  const uri = `mongodb://${username}:${password}@${Replica_Set_One},${Replica_Set_Two},${Replica_Set_Three}/${dbName}?replicaSet=${replicaSetName}&authSource=admin`;

  try {
    console.log("Establishing slow tunnel connection:")
    const conn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("connection to DB established::")
    return models(conn);
  } catch (error) {
    console.log("Error while connecting ", error);
  }
}


