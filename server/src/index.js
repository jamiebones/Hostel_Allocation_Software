import cors from "cors";
import express from "express";
import schema from "./schema";
import resolvers from "./resolvers";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import DataLoader from "dataloader";
import loaders from "./loaders";
import init from "./modules";
import config from "./config";
import cron from "node-cron";
import utils from "./utils";
import dbConnection from "./connections";

const morgan = require("morgan");

StartUp();

async function StartUp() {
  const app = express();
  app.use(cors());

  cron.schedule("*/10 * * * *", async function () {
    await utils.RemoveOnHoldBed();
    console.log("running a task every ten minute");
  });

  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined", { stream: config.winston.stream }));
  }

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, connection }) => {
      const user = config.isAuth(req);
      const { slowConn, fastConn } = dbConnection;
      if (connection) {
        console.log("connection started here please");
        return { slowConn, fastConn, config, req, user };
      }

      if (req) {
        //console.log("reg is here");
        //slowConn and fastConn represents the database connections
        return {
          user,
          slowConn,
          fastConn,
          config,
          req,
          loaders: {
            user: new DataLoader((keys) =>
              loaders.user.batchUsers(keys, slowConn)
            ),
          },
        };
      }
    },
    playground: {
      settings: {
        "editor.theme": "light",
      },
    },
  });

  await init.InitTask;
  //create the collection models if it does not already exists
  config.createCollection;

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    config.winston.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
    res.status(err.status || 500);
  });

  server.applyMiddleware({ app, path: "/graphql" });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
  process.on("uncaughtException", function (err) {
    //log all uncaught exceptions
    console.log(err);
  });
  
}
