export default {
  Query: {
    getDepartments: async (parent, {}, { fastConn, slowConn }) => {
      const depts = await fastConn.models.Department.find({});
      return depts;
    },
    getDepartmentInFaculty: async (parent, { faculty }, { fastConn, slowConn }) => {
      const depts = await fastConn.models.Department.find({ faculty: faculty });
      return depts;
    },

    oneDepartment: async (parent, { deptId }, { fastConn, slowConn}) => {
      const dept = await fastConn.models.Department.findOne({ _id: deptId });
      return dept;
    },
  },

  Mutation: {
    createDepartment: async (
      parent,
      { faculty, department, programDuration },
      { fastConn, slowConn }
    ) => {
      const newDept = new fastConn.models.Department({
        faculty,
        department,
        programDuration,
      });

      await newDept.save();
      return newDept;
    },
  },
};
