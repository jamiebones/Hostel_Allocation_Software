import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getBedAlloctedStats(session: String!): [BedAlloctedStat!]
  }

  extend type Mutation {
    updateBedAlloctedStats(session: String!): BedAlloctedStat
  }

  type BedAlloctedStat {
    session: String
    finalYear: Int
    firstYear: Int
    others: Int
  }
`;
