import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllBeds: [BedSpace!]
    getOneBed(bedId: ID!): BedSpace
    getbedsByStatus(status: String!): [BedSpaceStatusStat]
    bedsInRoom(roomId: ID!): [BedSpace!]
    getbedSpaceReserved(regNumber: String!): BedSpace
    getLockedBedSpace: [LockedBedSpace]
    getBedStatistic: TotalBedsAndLockedBedStats
    getStatsByHall: [TotalBedCountStatistic]
  }

  extend type Mutation {
    lockAllBedSpace: Boolean!
    openAllBedSpace: Boolean!
    changeBedStatus(newStatus: String!, bedId: ID!): String
    allocateBedSpace(regNumber: String!): BedSpace
    placeStudentInBedSpace(regNumber: String!, bedId: ID!): Boolean!
    dashStudentFreeBed(regNumber: String!, bedId: ID!): Boolean!
  }

  extend type Subscription {
    bedStatistics: BedSpaceStats!
  }

  type BedSpace {
    id: ID!
    roomNumber: String!
    hallName: String!
    hallId: ID!
    roomType: String!
    location: String!
    bedStatus: String
    lockStart: Date
    bedNumber: String!
    bedStatusType: String
    roomId: ID!
    hall: Hostel
  }

  type _id {
    bedStatus: String
    roomType: String
  }

  type BedSpaceStats {
    _id: _id
    total: String
  }

  type RoomsArrayGroup {
    room: String
    beds: [BedNumberGroup]
  }

  type BedNumberGroup {
    bedNumber: String
    bedStatus: String
  }

  type BedSpaceStatusStat {
    hallName: String
    rooms: [RoomsArrayGroup]
  }

  type BedIdGroup {
    bedNumber: String
    bedId: String
  }

  type RoomsArrayGroupBed {
    room: String
    beds: [BedIdGroup]
  }

  type LockedBedSpace {
    hallName: String
    rooms: [RoomsArrayGroupBed]
    location: String
    roomType: String
  }

  type TotalBedsAndLockedBedStats {
    totalSpace: String!
    reservedSpace: String!
  }

  type HallBedStatus {
    status: String!
    hallName: String!
  }

  type TotalBedCountStatistic {
    _id: HallBedStatus!
    count: String!
  }
`;

// db.bedspaces.aggregate([
//   {
//     $match: {
//       $or: [
//         { bedStatus: "onhold" },
//         { bedStatus: "vacant" },
//         { bedStatus: "occupied" },
//         {bedStatus: "locked"}
//       ],
//     },
//   },

//   { $group: { _id:{status: "$bedStatus", hallName: "$hallName"}, count: { $sum: 1 } } },
//   {$sort: {"_id.hallName": 1}}
// ]);
