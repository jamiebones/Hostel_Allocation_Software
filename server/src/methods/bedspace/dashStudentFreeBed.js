import {
  checkIfSpaceAlreadyAllocatedToStudentThatSession,
  checkIfSpaceIsOnHold,
} from "./commonAllocationUtil";
const { runInTransaction } = require("mongoose-transact-utils");
import studentBioMethod from "../studentBio";

export default async function placeStudentInBedSpace(
  regNumber,
  bedId,
  user,
  models
) {
  return await runInTransaction(async (session) => {
    try {
      //confirm if the person is a valid student
      const student = await studentBioMethod.confirmStudentShip(regNumber);
      if (!student)
        throw new Error(
          `Can not find student records with the given reg number : ${regNumber}`
        );

      //update the student level here
      const updatedStudent = await studentBioMethod.updateStudentLevel(
        student,
        session
      );
      if (!updatedStudent) {
        throw new Error(
          "There was a problem getting your records. Please contact admin"
        );
      }

      const { currentSession } = updatedStudent;

      //check if the student already have a space on hold

      await Promise.all([
        checkIfSpaceAlreadyAllocatedToStudentThatSession(
          regNumber,
          currentSession,
          session
        ),
        checkIfSpaceIsOnHold(regNumber, currentSession, session),
      ]);

      //mark the bed as occupied here and assign it to the student

      //if we get here we are successful.
      await Promise.all([
        addUserToAllocatedBedSpace({
          bedId,
          transactionSession: session,
          regNumber,
          student: updatedStudent,
          models,
        }),
        markRoomAsOccupied(bedId, session, models),
        logAdminGiveBedSpace({
          bedId,
          transactionSession: session,
          regNumber,
          student: updatedStudent,
          user,
          models,
        }),
      ]);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}

const addUserToAllocatedBedSpace = async ({
  regNumber,
  bedId,
  transactionSession,
  student,
  models,
}) => {
  const bedSpace = await models.BedSpace.findOne({ _id: bedId });

  const { roomNumber, roomId, hallName, hallId, bedNumber } = bedSpace;

  const newbedSlot = new models.BedSpaceAllocation({
    hallId,
    hallName,
    roomId,
    session: student.currentSession,
    regNumber,
    studentName: student.name,
    roomNumber,
    bedSpace: bedNumber,
    studentConfirmed: true,
  });

  newbedSlot.save({ session: transactionSession });
  return student;
};

const markRoomAsOccupied = async (bedId, transactionSession, models) => {
  await models.BedSpace.updateOne(
    { _id: bedId },
    { $set: { bedStatus: "occupied" } }
  ).session(transactionSession);
};

const logAdminGiveBedSpace = async ({
  regNumber,
  bedId,
  transactionSession,
  student,
  user,
  models,
}) => {
  const bedSpace = await models.BedSpace.findOne({ _id: bedId }).session(
    transactionSession
  );

  const { roomNumber, roomId, hallName, hallId, bedNumber } = bedSpace;
  const adminAllocatedSpace = new models.AdminRoomAllocation({
    session: student.currentSession,
    date: new Date(),
    regNumber,
    name: student.name,
    alloctedBy: user.email,
    roomNumber,
    roomId,
    hallId,
    hallName,
    bedNumber,
  });

  adminAllocatedSpace.save();
  return;
};
