export default {
  Query: {
    getDepartments: async (parent, {}, { models }) => {
      const depts = await models.Department.find({});
      return depts;
    },
    getDepartmentInFaculty: async (parent, { faculty }, { models }) => {
      const depts = await models.Department.find({ faculty: faculty });
      return depts;
    },

    oneDepartment: async (parent, { deptId }, { models }) => {
      const dept = await models.Department.findOne({ _id: deptId });
      return dept;
    },
  },

  Mutation: {
    createDepartment: async (
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
};
