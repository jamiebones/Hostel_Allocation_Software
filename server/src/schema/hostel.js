import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllHalls: [Hostel!]
    getOneHall(hallId: ID!): Hostel
    hallByType(type: String!): [Hostel!]
    getHallByLocationAndType(hallType: String!, location: String!): [Hostel!]
  }

  extend type Mutation {
    createHostelHall(
      hallName: String!
      type: String!
      location: String!
      hostelFee: String!
      status: String!
      occupiedByLevel: [ String ]
      occupiedBy: [String]
    ): Hostel!
    updateHostelFee(hallId: ID!, fees: String!): Boolean!
  }

  type Hostel {
    id: ID
    hallName: String
    type: String
    location: String
    hostelFee: String
    status: String
    occupiedBy: [String]
    occupiedByLevel: [String]
    rooms: [Room]
  }
`;
