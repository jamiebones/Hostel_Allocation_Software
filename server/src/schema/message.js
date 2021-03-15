import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    checkCredit:String!
    checkMessageStatus(messageId: ID!): BulkMessageStatus
  
  }

  extend type Mutation {
    sendMessage(to: String! from: String message: String): Message!
    
  }

 
 

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type SMSCredit {
    sms_credit: String!
  }
 
  type MessageCreated {
    message: Message!
  }

  type Message {
    messageId: ID!
    from: String!
    receipents: String!,
    date: Date,
    message: String
  }

  type BulkMessageStatus {
    bulk_message_id: ID!
    status: String
    created: String
    processed: String
    total_numbers: String
    total_unique_numbers: String
    total_valid_numbers: String
    total_invalid_numbers: String
  }
`;
