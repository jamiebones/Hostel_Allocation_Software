export default {
  Query: {
    getAllRooms: async (parent, args, { models }) => {
      const rooms = await models.Room.find({});
      return rooms;
    },

    getOneRoom: async (parent, { roomId }, { models }) => {
      const room = await models.Room.findOne({ _id: roomId });
      return room;
    },

    roomsInHall: async (parent, { hallId }, { models }) => {
      const rooms = await models.Room.find({ hallId: hallId });
      return rooms;
    },
  },

  Mutation: {
    createRoom: async (
      parent,
      {
        input: {
          roomNumber,
          totalBedSpace,
          hallName,
          hallId,
          location,
          roomType,
          singleBed,
        },
      },
      { models }
    ) => {
      try {
        const midPoint = +totalBedSpace / 2;
        //check if we have a valid hall here
        const hall = await models.Hostel.findById(hallId);
        if (!hall) {
          //throw error and exit
          throw new Error(
            "The requested hall does not exist to create room in it"
          );
        }
        //check if we have already created the room before
        const room = await models.Room.findOne({
          hallId: hallId,
          roomNumber: roomNumber.toLowerCase(),
        });
        if (room) {
          throw new Error(
            `${roomNumber} aleady exist in the hostel ${hallName}`
          );
        }
        //we good here lets create a new room here

        //check if the room is a special reserved room for a particular faculty or just a normal room

        const hallStatus = hall.status;
        let bedStatusType;

        hallStatus === "special"
          ? (bedStatusType = "special")
          : (bedStatusType = "normal");

        const newRoom = new models.Room({
          roomNumber,
          totalBedSpace,
          hallName,
          hallId,
          location,
          roomType,
        });
        await newRoom.save();
        const roomId = newRoom._id;
        if (singleBed) {
          for (let i = 1; i <= +totalBedSpace; i++) {
            const downBunk = {
              bedNumber: `${i}S`,
              bedStatus: "locked",
            };

            const downBed = new models.BedSpace({
              roomNumber,
              roomId,
              hallName,
              hallId,
              location,
              roomType,
              bedNumber: downBunk.bedNumber,
              bedStatus: downBunk.bedStatus,
              bedStatusType,
            });

            await downBed.save();
            //where we save the bed space to the room.
          }
        } else {
          for (let i = 1; i <= midPoint; i++) {
            const upBunk = {
              bedNumber: `${i}B`,
              bedStatus: "locked",
            };

            const upBed = new models.BedSpace({
              roomNumber,
              roomId,
              hallName,
              hallId,
              location,
              roomType,
              bedNumber: upBunk.bedNumber,
              bedStatus: upBunk.bedStatus,
              bedStatusType,
            });

            await upBed.save();

            const downBunk = {
              bedNumber: `${i}A`,
              bedStatus: "locked",
            };

            const downBed = new models.BedSpace({
              roomNumber,
              roomId,
              hallName,
              hallId,
              location,
              roomType,
              bedNumber: downBunk.bedNumber,
              bedStatus: downBunk.bedStatus,
              bedStatusType,
            });

            await downBed.save();
            //where we save the bed space to the room.
          }
        }
        return newRoom;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    lockAllBedsInRoom: async (parent, { roomId }, { models }) => {
      const update = { bedStatus: "locked" };

      await models.BedSpace.updateMany({ roomId: roomId }, update);

      return true;
    },
  },
  Room: {
    hall: async (room, {}, { models }) => {
      const hostel = await models.Hostel.findById(room.hallId);
      return hostel;
    },
    beds: async (room, {}, { models }) => {
      const beds = await models.BedSpace.find({ roomId: room.id });
      return beds;
    },
  },
};
