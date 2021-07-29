import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    successfultransactions(
      session: String!
      successful: Boolean!
    ): [Transaction!]
    studentTransaction(regNumber: String!): [Transaction]
    confirmTransactionUsingRRR(
      orderID: String!
      RRR: String!
    ): TransactionStatus
    getTransactionWithRRR(rrr: String!): Transaction
    getSuccessfulTransactionsBySession(session: String!): [Transaction!]!
  }

  extend type Mutation {
    initiateHostelFeePayment(regNumber: String!): Transaction
    confirmTransaction(flutterId: String!, transId: String!): Transaction
    generateRemitaRRR(regNumber: String!): RRRStatus
    simulateRemitaTransaction(regNumber: String!): TransactionStatus
  }

  type Transaction {
    id: ID!
    amount: String!
    transactionId: String
    paymentId: String
    payerId: String
    payerName: String
    regNumber: String
    session: String!
    date: Date
    successful: Boolean
    student: StudentBio!
    roomDetails: RoomDetails
    rrr: String
    transactionStatus: String
  }

  input TransactionInput {
    amount: String!
    transactionId: String
    payerId: String
    session: String!
  }

  type RoomDetails {
    roomNumber: String
    hallName: String
    bedSpace: String
    roomId: ID
    hallId: ID
    bedId: ID
    location: String
    roomType: String
  }

  type RRRStatus {
    statuscode: String
    RRR: String
    status: String
    regNumber: String
    amount: String
    env: RemitaEnvironment
  }

  type TransactionStatus {
    message: String
    status: String
  }

  type RemitaEnvironment {
    MerchantId: String
    Api_Key: String
    ServiceTypeId: String
    Gateway: String
    CheckStatusUrl: String
    ReturnRemitaUrl: String
    RRRGateWayPaymentUrl: String
  }
`;
