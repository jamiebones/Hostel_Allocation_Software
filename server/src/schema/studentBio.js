import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    contactUniuyoPortal(regNumber: String!): StudentBio
    studentData(regNumber: String!): StudentBio
  }

  extend type Mutation {
    createStudentAccount(input: StudentDataInput): StudentBio
  }

  input StudentDataInput {
    regNumber: String!
    email: String!
    sex: String!
    name: String!
    dept: String!
    faculty: String!
    phoneNumber: String!
    currentLevel: String!
    currentSession: String!
    profileImage: String
    entryMode: String!
    password: String!
    nextofKin: NextofKinInput
  }

  input NextofKinInput {
    name: String
    address: String
    phone: String
  }

  type NextofKin {
    name: String
    address: String
    phone: String
  }

  type StudentBio {
    id: ID!
    regNumber: String!
    email: String!
    sex: String!
    name: String!
    dept: String!
    faculty: String!
    phoneNumber: String!
    currentLevel: String!
    currentSession: String!
    profileImage: String
    entryMode: String!
    nextofKin: NextofKin
  }

  fragment StudentInfo on StudentBio {
    regNumber: String
    email: String
    sex: String
    name: String
    dept: String
    faculty: String
    phoneNumber: String
    currentLevel: String
    currentSession: String
    profileImage: String
    entryMode: String
  }
`;
