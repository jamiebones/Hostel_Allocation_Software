export default {
  Query: {
    getAllBedAllocationBySession: async (parent, { session }, { models }) => {
      const allocations = await models.BedSpaceAllocation.find({
        session: session,
      });
      return allocations;
    },
    getAllBedAllocationByHall: async (
      parent,
      { session, hallId },
      { models }
    ) => {
      const allocations = await models.BedSpaceAllocation.find({
        session: session,
        hallId: hallId,
      });
      return allocations;
    },
    getAllBedAllocationByRoom: async (
      parent,
      { session, roomId },
      { models }
    ) => {
      const allocations = await models.BedSpaceAllocation.find({
        session: session,
        roomId: roomId,
      });
      return allocations;
    },
    getAllConfirmedBedAllocationByRoom: async (
      parent,
      { session, roomId },
      { models }
    ) => {
      const allocations = await models.BedSpaceAllocation.find({
        session: session,
        roomId: roomId,
        studentConfirmed: true,
      });
      return allocations;
    },

    getAllocationToStudent: async (_, { regNumber, session }, { models }) => {
      const allocation = await models.BedSpaceAllocation.findOne({
        session: session,
        regNumber: regNumber.toLowerCase(),
      });
      if (allocation) return allocation;
      throw new Error(`There is no bed space for ${regNumber}`);
    },
  },

  Mutation: {
    confirmStudent: async (_, { regNumber, session }, { models }) => {
      const studentAllocation = await models.BedSpaceAllocation.findOne({
        regNumber: regNumber.toLowerCase(),
        session: session,
      });
      studentAllocation.studentConfirmed = true;
      await studentAllocation.save();
      return true;
    },
  },
  BedSpaceAllocation: {
    student: async (parent, {}, { models }) => {
      const student = await models.StudentBio.findOne({
        regNumber: parent.regNumber,
      });
      return student;
    },
    room: async (parent, {}, { models }) => {
      const room = await models.Room.findOne({
        _id: parent.roomId,
      });
      return room;
    },
  },
};
