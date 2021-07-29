import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, isAdmin } from "./authorization";

export default {
  Query: {
    adminAllocationBySession: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { session }, { fastConn }) => {
        const roomDashedByAdmin = await fastConn.models.AdminRoomAllocation.find(
          {
            session: session,
          }
        );
        return roomDashedByAdmin;
      }
    ),
  },

  AdminRoomAllocation: {
    student: async (parent, {}, { fastConn }) => {
      const student = await fastConn.models.StudentBio.findOne({
        regNumber: parent.regNumber.toLowerCase(),
      });
      return student;
    },
  },
};
