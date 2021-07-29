import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    createBedHold(input: OnHoldBedInput): OnHoldBed
  }

  input OnHoldBedInput {
    session: String
    bedId: ID
    regNumber: String
    lockStart: Date
  }

  type OnHoldBed {
    bedId: String!
    regNumber: String!
    session: String!
    student: User
    lockStart: Date
  }
`;
