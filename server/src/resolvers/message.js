
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./authorization";

import pubsub, { EVENTS } from '../subscription';

import methods from "../methods"
 

const toCursorHash = (string) => Buffer.from(string).toString("base64");

const fromCursorHash = (string) =>
  Buffer.from(string, "base64").toString("ascii");

export default {
  Query: {
    messages: async (parent, { cursor, limit = 3 }, { models }) => {
      const query = models.Message.find({});
      query.sort({ createdAt: -1 });
      query.limit(limit + 1);
      cursor && query.where("createdAt").lt(fromCursorHash(cursor));

      const messages = await query.exec();
      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      return {
        edges,
        pageInfo: {          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
    text: async (parent, {regNumber}, {models}) => {
      const stats = await methods.BedStats();
      return stats;
      console.log(stats);
    }
  },
  Mutation: {
    createMessage: combineResolvers(
      // isAuthenticated,
      async (parent, { text, userId }, { me, models }) => {
        const message = new models.Message({
          text,
          userId,
        });

        await message.save();
        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message },
        });
 
        return message;
      }
    ),

    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      models.messages = otherMessages;

      return true;
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },

  Message: {
    user: async (message, args, { loaders }) => {
      return await loaders.user.load(message.userId);

    // user: (message, args, { models }) => {
    //   return models.User.findOne({ _id: message.userId });
    // },
  }
}
};
