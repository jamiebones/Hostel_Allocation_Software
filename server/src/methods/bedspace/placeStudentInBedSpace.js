import {
  checkIfSpaceAlreadyAllocatedToStudentThatSession,
  checkIfSpaceIsOnHold,
  saveBedSpaceOnHold,
} from "./commonAllocationUtil";
const { runInTransaction } = require("mongoose-transact-utils");
import studentBioMethod from "../studentBio";

export default async function placeStudentInBedSpace(regNumber, bedId) {
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

      //place the bedspace and save it to the student
      await saveBedSpaceOnHold(bedId, regNumber, currentSession, session);

      //if we get here we are successful.
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}
