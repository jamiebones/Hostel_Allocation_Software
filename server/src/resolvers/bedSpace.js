import util from "../utils";
import methods from "../methods";
const { runInTransaction } = require("mongoose-transact-utils");
import pubsub, { EVENTS } from "../subscription";

export default {
  Query: {
    getAllBeds: async (parent, {}, { fastConn, slowConn }) => {
      const beds = await fastConn.models.BedSpace.find({});
      return beds;
    },

    getBedStatistic: async (parent, {}, { slowConn }) => {
      //get all beds in system
      const total = await slowConn.models.BedSpace.countDocuments();
      const lockedBeds = await slowConn.models.BedSpace.countDocuments({
        bedStatus: "locked",
      });

      return {
        totalSpace: total,
        reservedSpace: lockedBeds,
      };
    },

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

    getLockedBedSpace: async (parent, {}, { fastConn, slowConn }) => {
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
    },

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
    lockAllBedSpace: async (parent, args, { fastConn, slowConn }) => {
      //lock all the bed space
      const bedUpdate = { bedStatus: "locked" };
      try {
        await fastConn.models.BedSpace.updateMany({}, bedUpdate);

        return true;
      } catch (error) {
        throw error;
      }
    },

    openAllBedSpace: async (parent, {}, { fastConn, slowConn }) => {
      //open all the bed space
      const bedUpdate = { bedStatus: "vacant" };
      try {
        await fastConn.models.BedSpace.updateMany({}, bedUpdate);
        return true;
      } catch (error) {
        throw error;
      }
    },

    changeBedStatus: async (
      parent,
      { newStatus, bedId },
      { fastConn, slowConn }
    ) => {
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
    },

    allocateBedSpace: async (parent, { regNumber }, { fastConn, slowConn }) => {
      try {
        const bed = await methods.bedSpaceMethod.allocateBedSpace(
          regNumber,
          fastConn
        );

        //stats
        const bedStats = await slowConn.models.BedStats;
        pubsub.publish(EVENTS.BEDSPACE.BedSpace_Stats, {
          bedStatistics: { bedStats },
        });
        return bed;
      } catch (error) {
        throw error;
      }
    },
    placeStudentInBedSpace: async (
      parent,
      { regNumber, bedId },
      { fastConn, slowConn }
    ) => {
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
    },
    dashStudentFreeBed: async (
      parent,
      { regNumber, bedId },
      { user, fastConn, slowConn }
    ) => {
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
    },
  },

  Subscription: {
    bedStatistics: {
      subscribe: () => pubsub.asyncIterator(EVENTS.BEDSPACE.BedSpace_Stats),
    },
  },

  BedSpace: {
    hall: async (bedspace, args, { fastConn, slowConn }) => {
      return await fastConn.models.hall.findOne({ _id: bedspace.hallId });
    },
  },
};
