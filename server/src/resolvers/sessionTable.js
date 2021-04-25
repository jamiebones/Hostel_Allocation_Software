import { combineResolvers } from "graphql-resolvers";
import {
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  isStudent,
} from "./authorization";
const _ = require("lodash");

export default {
  Query: {
    getSessionById: async (parent, { sessionId }, { fastConn, slowConn }) => {
      const sessionData = await fastConn.models.SessionTable.findOne({
        _id: sessionId,
      });
      return sessionData;
    },
    allSessions: async (parent, {}, { fastConn, slowConn }) => {
      const session = await fastConn.models.SessionTable.find().sort({
        session: -1,
      });
      return session;
    },
  },

  Mutation: {
    createSession: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (_, { input }, { fastConn }) => {
        const {
          session,
          facultyAllocation,
          levelAllocation,
          active,
          shouldUpdateLevel,
        } = input;
        const newSession = new fastConn.models.SessionTable({
          session,
          facultyAllocation,
          levelAllocation,
          active,
          shouldUpdateLevel,
        });
        try {
          //loop through the faculty allocation array
          //check if we already have a session created
          const findSession = await fastConn.models.SessionTable.findOne({
            session,
          });
          if (findSession) {
            throw new Error(
              `${session} session is saved already in the database.`
            );
          }
          const facTotal = facultyAllocation.reduce((total, faculty) => {
            return (total = +faculty.percentAllocation + total);
          }, 0);

          const levelTotal = levelAllocation.reduce((total, level) => {
            return (total += level.percentAllocation);
          }, 0);

          if (facTotal > 100 || facTotal < 100) {
            throw new Error(
              `Faculty total allocation should equal 100. Value currently is ${facTotal}`
            );
          }
          if (levelTotal > 100 || levelTotal < 100) {
            throw new Error(
              `Level total allocation should equal 100. Value currently is ${levelTotal}`
            );
          }

          await newSession.save();
          return newSession;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    updateSession: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (_, { input, sessionId }, { fastConn, slowConn }) => {
        const { facultyAllocation, levelAllocation, shouldUpdateLevel } = input;

        try {
          //loop through the faculty allocation array
          const sessionToUpdate = await fastConn.models.SessionTable.findOne({
            _id: sessionId,
          });
          const prevFacAllocation = sessionToUpdate.facultyAllocation;
          const prevLevelAllocation = sessionToUpdate.levelAllocation;

          const facTotal = facultyAllocation.reduce((total, faculty) => {
            return (total = +faculty.percentAllocation + total);
          }, 0);

          const levelTotal = levelAllocation.reduce((total, level) => {
            return (total += level.percentAllocation);
          }, 0);

          if (facTotal > 100 || facTotal < 100) {
            throw new Error(
              `Faculty total allocation should eaual 100. Value currently is ${facTotal}`
            );
          }
          if (levelTotal > 100 || levelTotal < 100) {
            throw new Error(
              `Level total allocation should eaual 100. Value currently is ${levelTotal}`
            );
          }
          const pipeline = [
            {
              $match: {
                bedStatus: "vacant",
              },
            },
            {
              $count: "total",
            },
          ];
          const vacantBedsArray = await slowConn.models.BedSpace.aggregate(
            pipeline
          );
          const total = vacantBedsArray[0].total;
          //loop and update everything
          const facultyArray = [];
          const levelArray = [];

          facultyAllocation.map((faculty) => {
            const percentAllocation =
              (faculty.percentAllocation * +total) / 100;
            faculty.totalAllocation = Math.floor(percentAllocation);
            //we need to get how many bed has been given out here
            const findPrevFacAllocation = prevFacAllocation.find(
              (ele) =>
                ele.facultyName.toLowerCase() ===
                faculty.facultyName.toLowerCase()
            );
            if (findPrevFacAllocation) {
              faculty.totalOccupied = findPrevFacAllocation.totalOccupied;
            }
            facultyArray.push(faculty);
          });

          levelAllocation.map((level) => {
            const percentAllocation = (level.percentAllocation * +total) / 100;
            level.totalAllocation = Math.floor(percentAllocation);
            const findPrevLevelAllocation = prevLevelAllocation.find(
              (ele) => ele.level.toLowerCase() === level.level.toLowerCase()
            );
            if (findPrevLevelAllocation) {
              level.totalOccupied = findPrevLevelAllocation.totalOccupied;
            }
            levelArray.push(level);
          });
          sessionToUpdate.facultyAllocation = facultyArray;
          sessionToUpdate.levelAllocation = levelArray;
          sessionToUpdate.shouldUpdateLevel = shouldUpdateLevel;
          await sessionToUpdate.save();
          //save active session here in redis

          return sessionToUpdate;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    activateSession: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (_, { sessionId }, { fastConn }) => {
        //loop through the faculty allocation array
        //check if any session is active first. only one session can be active at a time

        try {
          const findActiveSession = await fastConn.models.SessionTable.findOne({
            active: true,
          });
          if (findActiveSession) {
            throw new Error(
              `${findActiveSession.session} is already active. Only one session can be active at a time`
            );
          }
          const sessionTable = await fastConn.models.SessionTable.findOne({
            _id: sessionId,
          });
          const pipeline = [
            {
              $match: {
                bedStatus: "vacant",
              },
            },
            {
              $count: "total",
            },
          ];
          const vacantBedsArray = await fastConn.models.BedSpace.aggregate(
            pipeline
          );
          const total = vacantBedsArray[0].total;

          //lets make all allocate spaces based on the shared criteria in the session object
          //lets find total bed spaces in rooms that are vacant and divide based on the criteria set
          const facultyAllocation = sessionTable.facultyAllocation;
          const levelAllocation = sessionTable.levelAllocation;

          //loop and update everything
          const facultyArray = [];
          const levelArray = [];
          let totalSpaceByFaculty = 0;
          let totalSpaceByLevel = 0;

          facultyAllocation.map((faculty) => {
            const percentAllocation =
              (faculty.percentAllocation * +total) / 100;
            faculty.totalAllocation = Math.floor(percentAllocation);
            totalSpaceByFaculty += Math.floor(percentAllocation);
            facultyArray.push(faculty);
          });

          levelAllocation.map((level) => {
            const percentAllocation = (level.percentAllocation * +total) / 100;
            level.totalAllocation = Math.floor(percentAllocation);
            totalSpaceByLevel += Math.floor(percentAllocation);
            levelArray.push(level);
          });

          //give the remaining space to the one with the lowest allocation

          //get leftover values
          let remainFacAllocation = total - totalSpaceByFaculty;
          let remainLevelAllocation = total - totalSpaceByLevel;

          const _ = require("lodash");

          const minFacultyAllocation = _.minBy(facultyArray, "totalAllocation");

          const minLevelAllocation = _.minBy(levelArray, "totalAllocation");

          //get and and the value to the remain one
          const filterFacArray = facultyArray.filter(
            (element) => element.facultyId != minFacultyAllocation.facultyId
          );

          //get and and the value to the remain one
          const filterLevelArray = levelArray.filter(
            (element) => element.level != minLevelAllocation.level
          );

          //update the value of the minimum allocation and add it back to the array
          minFacultyAllocation.totalAllocation =
            minFacultyAllocation.totalAllocation + remainFacAllocation;
          filterFacArray.push(minFacultyAllocation);

          minLevelAllocation.totalAllocation =
            minLevelAllocation.totalAllocation + remainLevelAllocation;
          filterLevelArray.push(minLevelAllocation);

          sessionTable.facultyAllocation = filterFacArray;
          sessionTable.levelAllocation = filterLevelArray;
          sessionTable.active = true;
          await sessionTable.save();
          return sessionTable;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
    deactivateSession: combineResolvers(
      isAuthenticated,
      isSuperAdmin,
      async (_, { sessionId }, { fastConn }) => {
        try {
          //loop through the faculty allocation array
          await fastConn.models.SessionTable.updateOne(
            { _id: sessionId },
            { active: false }
          );

          return true;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
};
