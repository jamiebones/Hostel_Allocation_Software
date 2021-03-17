import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllBedAllocationBySession(session: String!): [BedSpaceAllocation!]
    getAllBedAllocationByHall(
      session: String!
      hallId: String!
    ): [BedSpaceAllocation!]
    getAllBedAllocationByRoom(
      session: String!
      roomId: String!
    ): [BedSpaceAllocation!]
    getAllConfirmedBedAllocationByRoom(
      session: String!
      roomId: String!
    ): [BedSpaceAllocation!]
    getAllocationToStudent(
      session: String!
      regNumber: String!
    ): BedSpaceAllocation
  }

  extend type Mutation {
    confirmStudent(regNumber: String!, session: String!): Boolean
  }

  type BedSpaceAllocation {
    hallId: String
    hallName: String
    roomId: String
    studentId: String
    roomNumber: String
    phoneNumber: String
    session: String
    regNumber: String
    studentName: String
    bedSpace: String
    student: StudentBio
    room: Room
    studentConfirmed: Boolean
  }
`;
