import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, isAdmin } from "./authorization";

export default {
  Query: {
    getAdminDashBoardStats: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, {}, { fastConn }) => {
        const [
          studentAccounts,
          hostelNumber,
          vacantBeds,
          lockedBeds,
          occupiedBeds,
        ] = await Promise.all([
          fastConn.models.StudentBio.countDocuments(),
          fastConn.models.Hostel.countDocuments(),
          fastConn.models.BedSpace.find({
            bedStatus: "vacant",
          }).countDocuments(),
          fastConn.models.BedSpace.find({
            bedStatus: "locked",
          }).countDocuments(),

          fastConn.models.BedSpace.find({
            bedStatus: "occupied",
          }).countDocuments(),
        ]);

        return {
          studentAccounts: +studentAccounts,
          hostelNumber: +hostelNumber,
          vacantBeds: +vacantBeds,
          lockedBeds: +lockedBeds,
          occupiedBeds: +occupiedBeds,
        };
      }
    ),
    getBedAlloctedStats: async (_, {}, {}) => {},
  },
  Mutation: {
    updateBedAlloctedStats: async (parent, {}, {}) => {},
  },
};
