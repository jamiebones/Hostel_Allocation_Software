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
    searchStudentAccount(regNumber: String!): [User]
  }

  extend type Mutation {
    createUser(username: String): User
    createStaffUserAccountByAdmin(
      email: String!
      password: String!
      name: String!
      role: String!
    ): Boolean
    activateDeactivateUser(userId: String!): Boolean
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
    active: Boolean
    id: ID
  }
`;
