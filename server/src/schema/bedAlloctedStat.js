import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getBedAlloctedStats(session: String!): [BedAlloctedStat!]
    getAdminDashBoardStats: AdminDashBoardStats
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

  type AdminDashBoardStats {
    studentAccounts: Int
    hostelNumber: Int
    vacantBeds: Int
    lockedBeds: Int
    occupiedBeds: Int
  }
`;
