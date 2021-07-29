import {
  checkIfSpaceAlreadyAllocatedToStudentThatSession,
  checkIfSpaceIsOnHold,
  saveBedSpaceOnHold,
} from "./commonAllocationUtil";

import studentBioMethod from "../studentBio";

export default async function placeStudentInBedSpace(regNumber, bedId, conn) {
  const session = await conn.startSession();
  session.startTransaction();
  try {
    //confirm if the person is a valid student
    const student = await studentBioMethod.confirmStudentShip(regNumber, conn);
    if (!student)
      throw new Error(
        `Can not find student records with the given reg number : ${regNumber}`
      );

    //update the student level here
    const updatedStudent = await studentBioMethod.updateStudentLevel(
      student,
      session,
      conn
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
        session,
        conn
      ),
      checkIfSpaceIsOnHold(regNumber, currentSession, session, conn),
    ]);

    //place the bedspace and save it to the student
    await saveBedSpaceOnHold(bedId, regNumber, currentSession, session, conn);
    //if we get here we are successful.
    await session.commitTransaction();
    return true;
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    throw error;
  } finally {
    session.endSession();
  }
}
