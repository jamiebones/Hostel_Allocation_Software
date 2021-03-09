import cors from "cors";
import express from "express";
import schema from "./schema";
import resolvers from "./resolvers";
import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import http from "http";
import DataLoader from "dataloader";
import loaders from "./loaders";
import initTask from "./modules/init";
import config from "./config";
import cron from "node-cron";
import utils from "./utils";
import fastConnection from "./connections/fast";
import slowConnection from "./connections/slow";

const morgan = require("morgan");

StartUp();

async function StartUp() {
  const app = express();
  app.use(cors());
  const fastConn = await fastConnection();
  const slowConn = await slowConnection();
  cron.schedule("*/10 * * * *", async function () {
    await utils.RemoveOnHoldBed(slowConn);
    console.log("running a task every ten minute.");
  });

  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined", { stream: config.winston.stream }));
  }

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError(err) {
      if (err instanceof AuthenticationError) {
        console.log("err", err);
        return err.message;
      }
      if (err instanceof UserInputError) {
        return new Error("Input not in the correct order");
      }
      if (err.message.startsWith("Database Error")) {
        return new Error("Internal server error");
      }
      console.log("this is an error", err);
      return err;
      //return new Error("There was an error");
    },
    context: async ({ req, connection }) => {
      const user = config.isAuth(req);
      //const { models } = slowConn;
      if (connection) {
        console.log("connection started here please");
        return { slowConn, fastConn, config, connection, user };
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
              loaders.user.batchUsers(keys, models)
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

  await initTask(fastConn);
  //create the collection models if it does not already exists
  await config.createCollection(fastConn);

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
    console.log("Apollo Server running on http://localhost:8000/graphql");
  });
  process.on("uncaughtException", function (err) {
    //log all uncaught exceptions
    console.log("error from uncaught exception", err);
  });
}
