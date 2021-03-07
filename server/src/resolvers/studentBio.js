import methods from "../methods";
import utils from "../utils";
const { runInTransaction } = require("mongoose-transact-utils");

export default {
  Query: {
    studentData: async (_, { regNumber }, { models }) => {
      const student = await models.StudentBio.findOne({
        regNumber: regNumber.toLowerCase(),
      });
      if (!student) {
        throw new Error(`${regNumber} not found in the database.`);
      }
      return student;
    },
    contactUniuyoPortal: async (_, args, { models }) => {
      const { regNumber } = args;
      //if (process.env.NODE_ENV === "development") {
      //code to run during development

      //check if student is already registered
      const student = await models.StudentBio.findOne({
        regNumber: { $regex: regNumber.toLowerCase(), $options: "i" },
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
    createStudentAccount: async (parents, args, { req, models, config }) => {
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

      return await runInTransaction(async (session) => {
        try {
          const studentData = await methods.studentBioMethod.createStudentAccount(
            { ...newStudent, password },
            models,
            session,
            config
          );
          return studentData;
        } catch (err) {
          console.log(err);
          config.winston.error(
            `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
              req.method
            } - ${req.ip}`
          );
          throw err;
        }
      });
    },
  },
};
