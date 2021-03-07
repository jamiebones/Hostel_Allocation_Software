import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    messages(cursor: String, limit: Int): MessageConnection!
    message(id: ID!): Message!
    text: [BedSpaceStats]
  }

  extend type Mutation {
    createMessage(text: String!, userId: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }
 
  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }
 
  type MessageCreated {
    message: Message!
  }

  type Message {
    id: ID!
    text: String
    createdAt: Date
    user: User
  }
`;
