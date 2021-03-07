import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    confirmIfPhone(regNumber: String!): Boolean
    checkPhoneEnteredMoreThanThreeTimes(regNumber: String!): String
  }

  extend type Mutation {
    phoneConfirmation(
      regNumber: String!
      phoneNumber: String
    ): ConfirmPhoneTable
    confirmCode(code: String, regNumber: String): ConfirmPhoneTable
  }

  type ConfirmPhoneTable {
    randomCode: String
    confirmStatus: Boolean
    regNumber: String
    timeSaved: Date
    phoneNumber: String
  }
`;
