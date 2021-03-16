import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    checkCredit: SMSCredit
    getSMSStatistics(batchId: String):SMSSTATISTICS
    getAmountSpent(batchId: String ): String
  }

  extend type Mutation {
    sendMessage(receipents: String!, sender: String, message: String): Message!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type SMSCredit {
    sms_credits: String
  }

  type MessageCreated {
    message: Message!
  }

  type Message {
    ID: ID!
    sender: String!
    batchId: ID!
    receipents: String!
    date: Date
    message: String
    status: String
    totalMessage: String
  }

  type MessageStatus {
    status: String
    totalMessage: String
    smsCost: String
  }

 

  type SMSSTATISTICS {
    UNDELIVERABLE: SMSSTATS
    EXPIRED: SMSSTATS
    REJECTED: SMSSTATS
    FAILED: SMSSTATS
    PENDING: SMSSTATS
    ACCEPTED: SMSSTATS
    DELIVERED: SMSSTATS
    total: SMSSTATS
  }

  type SMSSTATS {
    sms_count: Int
    sms_units: Int 
  }
  
`;
