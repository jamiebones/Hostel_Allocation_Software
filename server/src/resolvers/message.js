import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./authorization";

import pubsub, { EVENTS } from "../subscription";

import methods from "../methods";

export default {
  Query: {
    checkCredit: async (_, {}, {}) => {
      const credit = await methods.messageMethod.CheapGlobalSMS.checkSMSCredit();
      return { sms_credits: credit };
    },
    getSMSStatistics: async (_, { batchId }, {}) => {
      const stats = await methods.messageMethod.CheapGlobalSMS.getSMSStatistics(
        batchId
      );
      return stats;
    },
    getAmountSpent: async (_, { batchId }, {}) => {
      const amount = await methods.messageMethod.CheapGlobalSMS.getAmountSpent(
        batchId
      );
      return amount && amount.toString();
    },
  },
  Mutation: {
    sendMessage: async (
      parent,
      { sender, receipents, message },
      { fastConn, slowConn }
    ) => {
      const messageRequest = await methods.messageMethod.CheapGlobalSMS.sendMessage(
        {
          receipents,
          sender,
          message: message,
        }
      );
      //we were successful in sending the message to the API. save the
      //message details in the database now

      const { status, totalMessage, batchId } = messageRequest;

      const newMessage = new fastConn.models.Message({
        message,
        sender,
        receipents,
        date: new Date(),
        status,
        totalMessage,
        batchId,
      });
      await newMessage.save();
      return newMessage;

    
    },
  },

  // Subscription: {
  //   messageCreated: {
  //     subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
  //   },
  // },

  // Message: {
  //   user: async (message, args, { loaders }) => {
  //     return await loaders.user.load(message.userId);

  //     // user: (message, args, { models }) => {
  //     //   return models.User.findOne({ _id: message.userId });
  //     // },
  //   },
  // },
};
