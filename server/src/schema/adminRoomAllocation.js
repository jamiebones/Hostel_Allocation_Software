import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    adminAllocationBySession(session: String!): [AdminRoomAllocation]
  }

  type AdminRoomAllocation {
    session: String
    date: Date
    regNumber: String
    student: StudentBio
    name: String
    phoneNumber: String
    alloctedBy: String
    roomNumber: String
    roomId: String
    hallId: String
    hallName: String
    bedNumber: String
  }
`;
