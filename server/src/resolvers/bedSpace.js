import util from "../utils";
import methods from "../methods";
import { combineResolvers } from "graphql-resolvers";
import {
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  isStudent,
} from "./authorization";

import pubsub, { EVENTS } from "../subscription";

export default {
  Query: {
    getStatsByHall: async (parent, {}, { slowConn }) => {
      const hostelStats = await slowConn.models.BedSpace.aggregate([
        {
          $match: {
            $or: [
              { bedStatus: "onhold" },
              { bedStatus: "vacant" },
              { bedStatus: "occupied" },
              { bedStatus: "locked" },
            ],
          },
        },

        {
          $group: {
            _id: { status: "$bedStatus", hallName: "$hallName" },
            count: { $sum: 1 },
          },
        },
      ]).allowDiskUse(true);
      const stats = hostelStats.sort((d1, d2) => d1._id.hallName - d2._id.hallName);
      return stats;
    },
    getAllBeds: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, {}, { fastConn, slowConn }) => {
        const beds = await fastConn.models.BedSpace.find({});
        return beds;
      }
    ),

    getBedStatistic: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, {}, { slowConn }) => {
        //get all beds in system
        const total = await slowConn.models.BedSpace.countDocuments();
        const lockedBeds = await slowConn.models.BedSpace.countDocuments({
          bedStatus: "locked",
        });

        return {
          totalSpace: total,
          reservedSpace: lockedBeds,
        };
      }
    ),

    getOneBed: async (parent, { bedId }, { fastConn, slowConn }) => {
      const bed = await fastConn.models.BedSpace.findOne({ _id: bedId });
      return bed;
    },

    getbedsByStatus: async (parent, { status }, { fastConn, slowConn }) => {
      //where we return aggregate of bed spaces with the grouping
      const pipeline = [
        status !== "all" ? { $match: { bedStatus: status } } : { $match: {} },

        {
          $group: {
            _id: {
              hallName: "$hallName",
              roomNumber: "$roomNumber",
            },
            total: { $sum: 1 },
            beds: {
              $push: { bedNumber: "$bedNumber", bedStatus: "$bedStatus" },
            },
          },
        },

        {
          $group: {
            _id: {
              hallName: "$_id.hallName",
            },
            total: { $sum: 1 },
            rooms: { $push: { room: "$_id.roomNumber", beds: "$beds" } },
          },
        },

        {
          $project: {
            hallName: "$_id.hallName",
            rooms: "$rooms",
          },
        },
      ];

      const totalSpace = await slowConn.models.BedSpace.aggregate(
        pipeline
      ).exec();
      return totalSpace;
    },

    getLockedBedSpace: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, {}, { fastConn, slowConn }) => {
        //where we return aggregate of bed spaces with the grouping
        const pipeline = [
          { $match: { bedStatus: "locked" } },

          {
            $group: {
              _id: {
                hallName: "$hallName",
                roomNumber: "$roomNumber",
                location: "$location",
                roomType: "$roomType",
              },
              beds: {
                $push: { bedNumber: "$bedNumber", bedId: "$_id" },
              },
            },
          },

          {
            $group: {
              _id: {
                hallName: "$_id.hallName",
                location: "$_id.location",
                roomType: "$_id.roomType",
              },
              rooms: { $push: { room: "$_id.roomNumber", beds: "$beds" } },
            },
          },

          {
            $project: {
              hallName: "$_id.hallName",
              rooms: "$rooms",
              location: "$_id.location",
              roomType: "$_id.roomType",
            },
          },
          {
            $sort: {
              location: 1,
              roomType: 1,
            },
          },
        ];

        const totalSpace = await slowConn.models.BedSpace.aggregate(
          pipeline
        ).exec();
        console.log(totalSpace);
        return totalSpace;
      }
    ),

    bedsInRoom: async (parent, { roomId }, { fastConn, slowConn }) => {
      const beds = await fastConn.models.BedSpace.find({ roomId: roomId });
      return beds;
    },

    getbedSpaceReserved: async (
      parent,
      { regNumber },
      { fastConn, slowConn }
    ) => {
      const onHoldBed = await fastConn.models.OnHoldBed.findOne({
        regNumber: regNumber,
      });
      if (onHoldBed) {
        const bedId = onHoldBed.bedId;
        const bed = await fastConn.models.BedSpace.findOne({ _id: bedId });
        return bed;
      }

      throw new Error("you do not have a bed space reserved");
    },
  },
  Mutation: {
    lockAllBedSpace: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (parent, args, { fastConn, slowConn }) => {
        //lock all the bed space
        //prevent opening bed spaces if we have an active session
        const sessionTable = await fastConn.models.SessionTable.findOne({
          active: true,
        });
        if (sessionTable) {
          throw new Error(
            "You can not lock all bed spaces when we have an active session. Please deactivate the session before you can continue"
          );
        }
        const bedUpdate = { bedStatus: "locked" };
        try {
          await fastConn.models.BedSpace.updateMany({}, bedUpdate);

          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    openAllBedSpace: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (parent, {}, { fastConn }) => {
        //open all the bed
        //prevent opening bed spaces if we have an active session
        const sessionTable = await fastConn.models.SessionTable.findOne({
          active: true,
        });
        if (sessionTable) {
          throw new Error(
            "You can not open all bed spaces when we have an active session. Please deactivate the session before you can continue"
          );
        }
        const bedUpdate = { bedStatus: "vacant" };
        try {
          await fastConn.models.BedSpace.updateMany({}, bedUpdate);
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    changeBedStatus: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { newStatus, bedId }, { fastConn }) => {
        const status = util.Utility.roomStatusObject[newStatus];
        if (status === util.Utility.roomStatusObject["vacant"]) {
          await fastConn.models.BedSpace.updateOne(
            { _id: bedId },
            { bedStatus: "vacant" }
          );
        }
        if (status === util.Utility.roomStatusObject["occupied"]) {
          await fastConn.models.BedSpace.updateOne(
            { _id: bedId },
            { bedStatus: "occupied" }
          );
        }
        if (status === util.Utility.roomStatusObject["reserved"]) {
          await fastConn.models.BedSpace.updateOne(
            { _id: bedId },
            { bedStatus: "reserved" }
          );
        }
        if (status === util.Utility.roomStatusObject["locked"]) {
          await fastConn.models.BedSpace.updateOne(
            { _id: bedId },
            { bedStatus: "locked" }
          );
        }

        if (status === util.Utility.roomStatusObject["timeLocked"]) {
          const now = new Date();
          await fastConn.models.BedSpace.updateOne(
            { _id: bedId },
            { bedStatus: "timeLocked", lockStart: now }
          );
        }

        return `status changed to ${newStatus}.`;
      }
    ),

    allocateBedSpace: combineResolvers(
      isAuthenticated,
      isStudent,
      async (parent, { regNumber }, { fastConn }) => {
        const bed = await methods.bedSpaceMethod.allocateBedSpace(
          regNumber,
          fastConn
        );
        return bed;
        //stats
        // const bedStats = await slowConn.models.BedStats;
        // pubsub.publish(EVENTS.BEDSPACE.BedSpace_Stats, {
        //   bedStatistics: { bedStats },
        // });
      }
    ),
    placeStudentInBedSpace: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { regNumber, bedId }, { fastConn, slowConn }) => {
        try {
          const success = await methods.bedSpaceMethod.placeStudentInBedSpace(
            regNumber,
            bedId,
            fastConn
          );

          return success;
        } catch (error) {
          throw error;
        }
      }
    ),
    dashStudentFreeBed: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { regNumber, bedId }, { user, slowConn }) => {
        try {
          const success = await methods.bedSpaceMethod.dashStudentFreeBed(
            regNumber,
            bedId,
            user,
            slowConn
          );

          return success;
        } catch (error) {
          throw error;
        }
      }
    ),
  },

  Subscription: {
    bedStatistics: {
      subscribe: () => pubsub.asyncIterator(EVENTS.BEDSPACE.BedSpace_Stats),
    },
  },

  BedSpace: {
    hall: async (bedspace, args, { fastConn, slowConn }) => {
      return await fastConn.models.Hostel.findOne({ _id: bedspace.hallId });
    },
  },
};
