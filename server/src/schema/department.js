import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
      getDepartments: [ Department! ]
      getDepartmentInFaculty(faculty: String!): [ Department! ]
      oneDepartment(deptId: ID!): Department!
    
  }
  extend type Mutation {
    createDepartment(
      faculty: String!
      department: String!
      programDuration: String!
    ): Department!
  }

  type Department {
    faculty: String
    department: String
    programDuration: String
  }
`;
