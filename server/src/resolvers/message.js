import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./authorization";

import pubsub, { EVENTS } from "../subscription";

import methods from "../methods";

console.log("methods", methods);

export default {
  Query: {
    checkMessageStatus: async (parent, { messageId }, {}) => {
      const messageStatus = await methods.messageMethod.JusibeModule.smsStatus(
        messageId
      );
      return messageStatus;
    },
    checkCredit: async (_, {}, {}) => {
      const credit = await methods.messageMethod.JusibeModule.checkCredit();
      return credit;
    },
  },
  Mutation: {
    sendMessage: async (
      parent,
      { to, from, message },
      { fastConn, slowConn }
    ) => {
      const messageRequest = await methods.messageMethod.JusibeModule.sendMessage(
        {
          receipent: to,
          from: from,
          message: message,
        }
      );
      //we were successful in sending the message to the API. save the
      //message details in the database now
      console.log("message sent is", messageRequest);
      const { bulk_message_id } = messageRequest;
      if (bulk_message_id) {
        const newMessage = new fastConn.models.Message({
          message,
          from,
          receipents: to,
          date: new Date(),
        });
        await newMessage.save();
        return {
          messageId: bulk_message_id,
          message,
          from,
          receipents: to,
          date,
        };
      } else {
        throw new Error("Could not send the message. Please try again");
      }
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
