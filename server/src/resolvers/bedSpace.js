import util from "../utils";
import methods from "../methods";
const { runInTransaction } = require("mongoose-transact-utils");
import pubsub, { EVENTS } from "../subscription";

export default {
  Query: {
    getAllBeds: async (parent, {}, { models }) => {
      const beds = await models.BedSpace.find({});
      return beds;
    },

    getBedStatistic: async (parent, {}, { models }) => {
      //get all beds in system
      const total = await models.BedSpace.countDocuments();
      const lockedBeds = await models.BedSpace.countDocuments({
        bedStatus: "locked",
      });

      return {
        totalSpace: total,
        reservedSpace: lockedBeds,
      };
    },

    getOneBed: async (parent, { bedId }, { models }) => {
      const bed = await models.BedSpace.findOne({ _id: bedId });
      return bed;
    },

    getbedsByStatus: async (parent, { status }, { models }) => {
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

      const totalSpace = await models.BedSpace.aggregate(pipeline).exec();
      return totalSpace;
    },

    getLockedBedSpace: async (parent, {}, { models }) => {
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

      const totalSpace = await models.BedSpace.aggregate(pipeline).exec();
      console.log(totalSpace);
      return totalSpace;
    },

    bedsInRoom: async (parent, { roomId }, { models }) => {
      const beds = await models.BedSpace.find({ roomId: roomId });
      return beds;
    },

    getbedSpaceReserved: async (parent, { regNumber }, { models }) => {
      const onHoldBed = await models.OnHoldBed.findOne({
        regNumber: regNumber,
      });
      if (onHoldBed) {
        const bedId = onHoldBed.bedId;
        const bed = await models.BedSpace.findOne({ _id: bedId });
        return bed;
      }

      throw new Error("you do not have a bed space reserved");
    },
  },
  Mutation: {
    lockAllBedSpace: async (parent, args, { models }) => {
      //lock all the bed space
      const bedUpdate = { bedStatus: "locked" };
      try {
        await models.BedSpace.updateMany({}, bedUpdate);

        return true;
      } catch (error) {
        throw error;
      }
    },

    openAllBedSpace: async (parent, {}, { models }) => {
      //open all the bed space
      const bedUpdate = { bedStatus: "vacant" };
      try {
        await models.BedSpace.updateMany({}, bedUpdate);
        return true;
      } catch (error) {
        throw error;
      }
    },

    changeBedStatus: async (parent, { newStatus, bedId }, { models }) => {
      const status = util.Utility.roomStatusObject[newStatus];
      if (status === util.Utility.roomStatusObject["vacant"]) {
        await models.BedSpace.updateOne(
          { _id: bedId },
          { bedStatus: "vacant" }
        );
      }
      if (status === util.Utility.roomStatusObject["occupied"]) {
        await models.BedSpace.updateOne(
          { _id: bedId },
          { bedStatus: "occupied" }
        );
      }
      if (status === util.Utility.roomStatusObject["reserved"]) {
        await models.BedSpace.updateOne(
          { _id: bedId },
          { bedStatus: "reserved" }
        );
      }
      if (status === util.Utility.roomStatusObject["locked"]) {
        await models.BedSpace.updateOne(
          { _id: bedId },
          { bedStatus: "locked" }
        );
      }

      if (status === util.Utility.roomStatusObject["timeLocked"]) {
        const now = new Date();
        await models.BedSpace.updateOne(
          { _id: bedId },
          { bedStatus: "timeLocked", lockStart: now }
        );
      }

      return `status changed to ${newStatus}.`;
    },

    allocateBedSpace: async (parent, { regNumber }, { models }) => {
      try {
        const bed = await methods.bedSpaceMethod.allocateBedSpace(regNumber);

        //stats
        const bedStats = await models.BedStats;
        pubsub.publish(EVENTS.BEDSPACE.BedSpace_Stats, {
          bedStatistics: { bedStats },
        });
        return bed;
      } catch (error) {
        throw error;
      }
    },
    placeStudentInBedSpace: async (parent, { regNumber, bedId }, {}) => {
      try {
        const success = await methods.bedSpaceMethod.placeStudentInBedSpace(
          regNumber,
          bedId
        );

        return success;
      } catch (error) {
        throw error;
      }
    },
    dashStudentFreeBed: async (
      parent,
      { regNumber, bedId },
      { user, models }
    ) => {
      try {
        const success = await methods.bedSpaceMethod.dashStudentFreeBed(
          regNumber,
          bedId,
          user,
          models
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
    hall: async (bedspace, args, { models }) => {
      return await models.hall.findOne({ _id: bedspace.hallId });
    },
  },
};
