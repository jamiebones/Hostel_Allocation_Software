import methods from "../methods";

export default {
  Query: {
    studentData: async (_, { regNumber }, { fastConn, slowConn }) => {
      const student = await fastConn.models.StudentBio.findOne({
        regNumber: regNumber.toLowerCase(),
      });
      if (!student) {
        throw new Error(`${regNumber} not found in the database.`);
      }
      return student;
    },
    contactUniuyoPortal: async (_, args, { fastConn }) => {
      const { regNumber } = args;
      //if (process.env.NODE_ENV === "development") {
      //code to run during development

      //check if student is already registered
      const student = await fastConn.models.StudentBio.findOne({
        regNumber: regNumber.toLowerCase(),
      });

      if (student) {
        return student;
      }
      throw new Error(
        `${regNumber} is not a student in Uniuyo student database`
      );
      // }
    },
  },

  Mutation: {
    createStudentAccount: async (parents, args, { req, fastConn, config }) => {
      const {
        input: {
          regNumber,
          email,
          name,
          dept,
          faculty,
          phoneNumber,
          entryMode,
          currentLevel,
          currentSession,
          password,
          nextofKin,
          sex,
          profileImage,
        },
      } = args;
      const newStudent = {
        regNumber,
        email,
        name,
        dept,
        faculty,
        phoneNumber,
        profileImage,
        entryMode,
        nextofKin,
        currentLevel,
        currentSession,
        sex,
      };

      try {
        const data = await methods.studentBioMethod.createStudentAccount(
          { ...newStudent, password },
          fastConn
        );
        console.log("data is data: ", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
