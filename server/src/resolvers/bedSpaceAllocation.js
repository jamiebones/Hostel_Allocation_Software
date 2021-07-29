import { combineResolvers } from "graphql-resolvers";
import {
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  isStudent,
} from "./authorization";

export default {
  Query: {
    getAllBedAllocationBySession: combineResolvers(
      isAuthenticated,
      async (parent, { session }, { fastConn, slowConn }) => {
        const allocations = await fastConn.models.BedSpaceAllocation.find({
          session: session,
        });
        return allocations;
      }
    ),
    getAllBedAllocationByHall: combineResolvers(
      isAuthenticated,
      async (parent, { session, hallId }, { fastConn, slowConn }) => {
        const allocations = await fastConn.models.BedSpaceAllocation.find({
          session: session,
          hallId: hallId,
        });
        return allocations;
      }
    ),
    getAllBedAllocationByRoom: isAuthenticated(
      isAuthenticated,
      async (parent, { session, roomId }, { fastConn, slowConn }) => {
        const allocations = await fastConn.models.BedSpaceAllocation.find({
          session: session,
          roomId: roomId,
        });
        return allocations;
      }
    ),
    getAllConfirmedBedAllocationByRoom: combineResolvers(
      isAuthenticated,
      async (parent, { session, roomId }, { fastConn, slowConn }) => {
        const allocations = await slowConn.models.BedSpaceAllocation.find({
          session: session,
          roomId: roomId,
          studentConfirmed: true,
        });
        return allocations;
      }
    ),

    getAllocationToStudent: combineResolvers(
      isAuthenticated,
      async (_, { regNumber, session }, { fastConn, slowConn }) => {
        const allocation = await fastConn.models.BedSpaceAllocation.findOne({
          session: session,
          regNumber: regNumber.toLowerCase(),
        });
        if (allocation) return allocation;
        throw new Error(`There is no bed space for ${regNumber}`);
      }
    ),
  },

  Mutation: {
    confirmStudent: async (
      _,
      { regNumber, session },
      { fastConn, slowConn }
    ) => {
      const studentAllocation = await fastConn.models.BedSpaceAllocation.findOne(
        {
          regNumber: regNumber.toLowerCase(),
          session: session,
        }
      );
      studentAllocation.studentConfirmed = true;
      await studentAllocation.save();
      return true;
    },
  },
  BedSpaceAllocation: {
    student: async (parent, {}, { fastConn, slowConn }) => {
      const student = await fastConn.models.StudentBio.findOne({
        regNumber: parent.regNumber,
      });
      return student;
    },
    room: async (parent, {}, { fastConn, slowConn }) => {
      const room = await fastConn.models.Room.findOne({
        _id: parent.roomId,
      });
      return room;
    },
  },
};
