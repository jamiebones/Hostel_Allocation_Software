import {
  checkAvailableSpace,
  specialHostelCheck,
  searchSpecialRoomType,
  checkIfSpaceAlreadyAllocatedToStudentThatSession,
  checkIfSpaceIsOnHold,
  findSpaceByLevelAndLocation,
  findSpaceByLevel,
  saveBedSpaceOnHold,
} from "./commonAllocationUtil";

import studentBioMethod from "../studentBio";

export default async function allocateHostelSpaceToStudent(regNumber, conn) {
  const session = conn.startSession();
  return await conn.transaction(async () => {
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

      const { levelType, faculty, currentSession, sex } = updatedStudent;

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

      const specialHostel = await specialHostelCheck(updatedStudent, session, conn);
      console.log(specialHostel);
      if (specialHostel) {
        const { hostel } = specialHostel;
        let specialBed = await searchSpecialRoomType(
          sex,
          hostel._id,
          levelType,
          session,
          conn
        );
        if (specialBed) {
          await saveBedSpaceOnHold(
            specialBed._id,
            regNumber,
            currentSession,
            session,
            conn
          );
          return specialBed;
        } else {
          throw new Error(`There is no more bed space available`);
        }
      }

      let checkForSpace;
      let tryAgainThreeTimes = 0;
      let valueInCheckForSpace;
      checkForSpace = await checkAvailableSpace({
        level: levelType,
        faculty,
        conn
      });

      valueInCheckForSpace = checkForSpace();
      if (valueInCheckForSpace.hasSpace === false && tryAgainThreeTimes <= 3) {
        while (tryAgainThreeTimes <= 3) {
          checkForSpace = await checkAvailableSpace({
            level: levelType,
            faculty,
            conn
          });
          console.log("value of try agaian is ", tryAgainThreeTimes);
          valueInCheckForSpace = checkForSpace();
          tryAgainThreeTimes++;
        }
      }

      let bed;
      const { hasSpace } = valueInCheckForSpace;
      if (hasSpace) {
        //lets check here for space
        bed = await findSpaceByLevelAndLocation(updatedStudent, session, conn);
        if (!bed) {
          //try without using location here
          bed = await findSpaceByLevel(updatedStudent, session, conn);
        }
      } else {
        throw new Error(`There is no more bed space available now.`);
      }

      if (!bed) {
        throw new Error(
          `There is no more bed space that fits your criteria at the moment`
        );
      }

      //lets proceed with our bed here.
      //save the bed space on hold here

      const bedOnHold = await saveBedSpaceOnHold(
        bed._id,
        regNumber,
        currentSession,
        session,
        conn
      );

      console.log(bedOnHold);

      //if we get here we are successful.
      return bedOnHold;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}
