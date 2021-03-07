export default {
  Query: {
    getLuckyCode: async (parent, {}, { models }) => {
      const depts = await models.Department.find({});
      return depts;
    },
    getSessionLuckyCodes: async (parent, { faculty }, { models }) => {
      const depts = await models.Department.find({ faculty: faculty });
      return depts;
    },
  },

  Mutation: {
    generateLuckyCode: async (
      parent,
      { faculty, department, programDuration },
      { models }
    ) => {
      const newDept = new models.Department({
        faculty,
        department,
        programDuration,
      });

      await newDept.save();
      return newDept;
    },
  },
  LuckyCode: {
    student: async (parent, {}, { models }) => {
      const student = await models.StudentBio.findOne({
        regNumber: parent.regNumber,
      });
      return student;
    },
    bedSpace: async (parent, {}, { models }) => {
      const bedSpace = await models.bedSpace.findOne({
        _id: parent.bedId,
      });
      return bedSpace;
    },
  },
};
