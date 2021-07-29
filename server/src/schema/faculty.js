import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    createFaculty(facultyName: String!, location: String!): Faculty
    updateFaculty(location: String!, facId: ID!): Faculty
  }

  extend type Query {
    allFaculties: [ Faculty! ]
  }

  type Faculty {
    id: ID!
    facultyName: String!
    location: String!
  }
`;
