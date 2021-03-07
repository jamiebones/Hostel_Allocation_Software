export default {
  Query: {
    adminAllocationBySession: async (parent, { session }, { models }) => {
      const roomDashedByAdmin = await models.AdminRoomAllocation.find({
        session: session,
      });
      return roomDashedByAdmin;
    },
  },

  AdminRoomAllocation: {
    student: async (parent, {}, { models }) => {
      const student = await models.StudentBio.findOne({
        regNumber: parent.regNumber.toLowerCase(),
      });
      return student;
    },
  },
};
