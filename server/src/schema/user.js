import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
    loginUser(
      regNumber: String
      password: String!
      email: String
    ): LoginUserResult
  }

  extend type Mutation {
    createUser(username: String): User
  }

  union LoginUserResult = User | Error

  type Error {
    message: String!
    type: String!
  }

  type User {
    email: String
    password: String
    userType: String
    accessLevel: String
    regNumber: String
    token: String
    name: String
  }
`;
