import { gql } from "apollo-server-express";

export default gql`

 extend type Query {
    allSessions:[SessionTable!]
    getSessionById(sessionId: ID!): SessionTable!
 }


 extend type Mutation {
    createSession(input: SessionInput): SessionTable
    updateSession(sessionId: ID!, input: SessionInput ): SessionTable
    activateSession(sessionId: ID!): Boolean!
    deactivateSession(sessionId: ID!): Boolean!
 }

input SessionInput {
    session: String
    facultyAllocation: [ FacultyAllocationInput ]
    levelAllocation: [ LevelAllocationInput ]
    active: Boolean
    shouldUpdateLevel: Boolean
}

input FacultyAllocationInput {
    facultyId: String
    facultyName: String
    percentAllocation: Int
    totalAllocation: Int
    totalOccupied: Int
}

input LevelAllocationInput {
    level: String
    percentAllocation: Int
    totalAllocation: Int
    totalOccupied: Int
}

type SessionTable {
    id: ID!
    session: String!,
    facultyAllocation: [FacultyAllocation!],
    levelAllocation: [LevelAllocation!],
    active: Boolean!,
    shouldUpdateLevel: Boolean
}

type FacultyAllocation {
    facultyId: String
    facultyName: String
    percentAllocation: Int
    totalAllocation: Int
    totalOccupied: Int
}

type LevelAllocation {
    level: String
    percentAllocation: Int
    totalAllocation: Int
    totalOccupied: Int
}


`;
