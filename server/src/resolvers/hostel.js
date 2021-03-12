export default {
  Query: {
    hostelDetailsByName: async (parent, { hostelName }, { slowConn }) => {
      const hostels = await slowConn.models.Hostel.find({
        hallName: { $regex: hostelName, $options: "i" },
      });

      return hostels;
    },
    getAllHalls: async (parent, args, { fastConn, slowConn }) => {
      const halls = await fastConn.models.Hostel.find({}).sort([
        ["location", 1],
        ["type", 1],
      ]);
      return halls;
    },

    getOneHall: async (parent, { hallId }, { fastConn, slowConn }) => {
      const hall = await fastConn.models.Hostel.findOne({ _id: hallId });
      return hall;
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
      { hallName, type, location, hostelFee, status, occupiedBy },
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
          hallObject.occupiedBy = occupiedBy;
        }
        const newHall = new fastConn.models.Hostel(hallObject);

        await newHall.save();
        return newHall;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    editHostelHall: async (
      parent,
      { hallId, hallName, type, location, hostelFee, status, occupiedBy },
      { fastConn, slowConn }
    ) => {
      try {
        //find the hall
        const hall = await fastConn.models.Hostel.findOne({ _id: hallId });
        if (!hall) {
          throw new Error("you can not update a hall that does not exists");
        }
        const hallObject = {
          hallName,
          type,
          location,
          hostelFee,
          status,
        };
        if (status === "special") {
          hallObject.occupiedBy = occupiedBy;
        }
        hall.hallName = hallName;
        hall.type = type;
        hall.location = location;
        hall.hostelFee = hostelFee;
        hall.status = status;
        await hall.save();
        return hall;
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
