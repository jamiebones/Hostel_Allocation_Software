const { runInTransaction } = require("mongoose-transact-utils");
import {
  markRoomAsOccupied,
  addUserToAllocatedBedSpace,
  saveNewTransaction,
} from "./transactionsUtil";
import studentBioMethod from "../studentBio";
import sessionTableMethod from "../sessionTable";
import bedSpaceMethod from "../bedspace";
const { getStudentData } = studentBioMethod.common;
const { getActiveSession } = sessionTableMethod.common;
const {
  getReservedBedSpace,
  getReservedBedDetails,
  confirmSpaceOnHoldThatSession,
  checkAvailableSpace,
  incrementRoomStats,
} = bedSpaceMethod.common;

export default async function simulateRemitaTransaction(regNumber, conn) {
  return await runInTransaction(async (transactionSession) => {
    try {
      const activeSession = await getActiveSession(conn);
      const student = await getStudentData(regNumber, conn);
      if (!student) throw new Error("Student data not found");
      const bed = await getReservedBedSpace(regNumber, activeSession.session, conn);
      let message = "Approved",
        status = "00";
      let studentData = student;
      if (bed) {
        //save new transaction here
        const bedDetails = await getReservedBedDetails(bed.bedId, conn);

        const newTransaction = await saveNewTransaction(
          studentData,
          activeSession.session,
          bedDetails,
          transactionSession,
          conn
        );

        let date = new Date();
        newTransaction.successful = true;
        newTransaction.rrr =
          "simulated_" +
          date.getMilliseconds() +
          date.getSeconds() +
          date.getMinutes();
        newTransaction.transactionStatus = "025";
        await newTransaction.save();
        const {
          regNumber,
          session,
          roomDetails: { bedId },
        } = newTransaction;
        const checkAllocation = await confirmSpaceOnHoldThatSession(
          regNumber,
          session,
          transactionSession,
          conn
        );
        if (checkAllocation) {
          //
          return { message, status };
        }
        //we can update the transaction here

        const [student] = await Promise.all([
          addUserToAllocatedBedSpace(newTransaction, transactionSession, conn),
          markRoomAsOccupied(bedId, transactionSession, conn),
        ]);
        const { levelType, faculty } = student;

        let checkForSpace = await checkAvailableSpace({
          level: levelType,
          faculty: faculty,
          conn
        });

        const { levelData, facultyData, sessionData } = checkForSpace();

        //this is called after payment
        await incrementRoomStats({
          levelData,
          facultyData,
          sessionData,
          session: transactionSession,
          conn
        });

        return { message, status };
      } else {
        throw new Error("you do not have a bed space on hold. ");
      }

      //lets update the transaction here
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}
