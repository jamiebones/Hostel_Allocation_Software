import util from "../utils";

export default {
  Query: {
    getAllHalls: async (parent, args, { fastConn, slowConn }) => {
      const halls = await fastConn.models.Hostel.find({}).sort([
        ["location", 1],
        ["type", 1],
      ]);
      return halls;
    },

    getOneHall: async (parent, { hallId }, { fastConn, slowConn }) => {
      const halls = await fastConn.models.Hostel.findOne({ _id: hallId });
      return halls;
    },

    getHallByLocationAndType: async (
      parent,
      { hallType, location },
      { fastConn, slowConn }
    ) => {
      const halls = await fastConn.models.Hostel.find({
        type: hallType,
        location,
      });
      return halls;
    },

    hallByType: async (parent, { type }, { fastConn, slowConn }) => {
      const hall = await fastConn.models.Hostel.find({ type: type });
      return hall;
    },
  },
  Mutation: {
    createHostelHall: async (
      parent,
      {
        hallName,
        type,
        location,
        hostelFee,
        status,
        occupiedByLevel,
        occupiedBy,
      },
      { fastConn, slowConn }
    ) => {
      try {
        const hallObject = {
          hallName,
          type,
          location,
          hostelFee,
          status,
        };
        if (status === "special") {
          hallObject.occupiedBy = util.Utility.convertStringArrayToLowerCase(
            occupiedBy
          );
          hallObject.occupiedByLevel = util.Utility.convertStringArrayToLowerCase(
            occupiedByLevel
          );
        }
        const newHall = new fastConn.models.Hostel(hallObject);

        await newHall.save();
        return newHall;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    updateHostelFee: async (parent, { hallId, fees }, { fastConn }) => {
      try {
        await fastConn.models.Hostel.updateOne({
          _id: hallId,
          hostelFee: fees,
        });
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Hostel: {
    rooms: async (hostel, {}, { fastConn }) => {
      const rooms = await fastConn.models.Room.find({ hallId: hostel._id });
      return rooms;
    },
  },
};
