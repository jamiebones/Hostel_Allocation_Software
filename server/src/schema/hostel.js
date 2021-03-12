import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllHalls: [Hostel!]
    getOneHall(hallId: ID!): Hostel
    hallByType(type: String!): [Hostel!]
    getHallByLocationAndType(hallType: String!, location: String!): [Hostel!]
    hostelDetailsByName(hostelName: String!): [Hostel!]!
  }

  extend type Mutation {
    createHostelHall(
      hallName: String!
      type: String!
      location: String!
      hostelFee: String!
      status: String!
      occupiedBy: [OccupiedByInput]
    ): Hostel!
    updateHostelFee(hallId: ID!, fees: String!): Boolean!
  }

  input OccupiedByInput {
    facultyName: String
    levels: [String]
  }

  type OccupiedBy {
    facultyName: String
    levels: [String]
  }

  type Hostel {
    id: ID
    hallName: String
    type: String
    location: String
    hostelFee: String
    status: String
    occupiedBy: [OccupiedBy]
    rooms: [Room]
  }
`;
