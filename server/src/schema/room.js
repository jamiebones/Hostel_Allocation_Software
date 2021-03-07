import { gql } from "apollo-server-express";

export default gql`
 extend type Query {
  getAllRooms: [Room!]
  getOneRoom(roomId: ID!): Room
  roomsInHall(hallId: ID!): [Room!]

 }

 extend type Mutation {
   createRoom(input: RoomInput ): Room
   lockAllBedsInRoom(roomId: ID!): Boolean

 }

 input RoomInput {
  roomNumber: String 
  totalBedSpace: String
  hallName: String 
  hallId: String 
  location: String
  roomType: String 
  singleBed: Boolean 
 }


  type Room {
    id: ID!
    roomNumber: String!
    bedSpace: [BedSpace!]
    totalBedSpace: String
    hallName: String
    hallId: String
    location: String
    roomType: String
    hall: Hostel
    beds: [BedSpace!]
  }

  
`;
