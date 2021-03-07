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
const { runInTransaction } = require("mongoose-transact-utils");
import studentBioMethod from "../studentBio";

export default async function allocateHostelSpaceToStudent(regNumber) {
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

      const { levelType, faculty, currentSession, sex } = updatedStudent;

      //check if the student already have a space on hold

      await Promise.all([
        checkIfSpaceAlreadyAllocatedToStudentThatSession(
          regNumber,
          currentSession,
          session
        ),
        checkIfSpaceIsOnHold(regNumber, currentSession, session),
      ]);

      const specialHostel = await specialHostelCheck(updatedStudent, session);
      console.log(specialHostel);
      if (specialHostel) {
        const { hostel } = specialHostel;
        let specialBed = await searchSpecialRoomType(
          sex,
          hostel._id,
          levelType,
          session
        );
        if (specialBed) {
          await saveBedSpaceOnHold(
            specialBed._id,
            regNumber,
            currentSession,
            session
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
      });

      valueInCheckForSpace = checkForSpace();
      if (valueInCheckForSpace.hasSpace === false && tryAgainThreeTimes <= 3) {
        while (tryAgainThreeTimes <= 3) {
          checkForSpace = await checkAvailableSpace({
            level: levelType,
            faculty,
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
        bed = await findSpaceByLevelAndLocation(updatedStudent, session);
        if (!bed) {
          //try without using location here
          bed = await findSpaceByLevel(updatedStudent, session);
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
        session
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
