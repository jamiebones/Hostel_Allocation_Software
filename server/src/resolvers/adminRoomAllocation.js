export default {
  Query: {
    adminAllocationBySession: async (parent, { session }, { fastConn, slowConn }) => {
      const roomDashedByAdmin = await fastConn.models.AdminRoomAllocation.find({
        session: session,
      });
      return roomDashedByAdmin;
    },
  },

  AdminRoomAllocation: {
    student: async (parent, {}, { fastConn, slowConn }) => {
      const student = await fastConn.models.StudentBio.findOne({
        regNumber: parent.regNumber.toLowerCase(),
      });
      return student;
    },
  },
};
