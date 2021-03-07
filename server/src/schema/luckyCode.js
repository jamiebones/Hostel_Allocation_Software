import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getLuckyCode(regNumber: String!, session: String!): LuckyCode
    getSessionLuckyCodes(session: String!): [LuckyCode!]
  }

  extend type Mutation {
    generateLuckyCode(regNumber: String!, session: String!): LuckyCode
  }

  type LuckyCode {
    id: ID!
    bedId: ID!
    bedNumber: String!
    session: String!
    luckyCode: String!
    regNumber: String!
    student: StudentBio
    bedSpace: BedSpace
  }
`;
