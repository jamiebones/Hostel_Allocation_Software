import studentBioMethod from "../studentBio";
import sessionTableMethod from "../sessionTable";
import bedSpaceMethod from "../bedspace";


const { getStudentData } = studentBioMethod.common;
const { getActiveSession } = sessionTableMethod.common;
const { getReservedBedSpace, getReservedBedDetails } = bedSpaceMethod.common;
import {
  saveNewTransaction,
  checkTransactionAlreadyWithRRR,
} from "./transactionsUtil.js";

var _ = require('lodash');


export default async function makeTransaction(regNumber, conn) {
  const transactionSession = conn.startSession();
  return await conn.transaction(async () => {
    try {
      const activeSession = await getActiveSession(conn);
      const student = await getStudentData(regNumber, conn);

      if (!student) throw new Error("Student data not found");

      const bed = await getReservedBedSpace(regNumber, activeSession.session, conn);

      if (bed) {
        //save new transaction here
        const bedDetails = await getReservedBedDetails(bed.bedId, conn);
        //check if there is already a transaction

        const transaction = await checkTransactionAlreadyWithRRR(
          regNumber,
          activeSession.session,
          transactionSession,
          conn
        );

        if (!_.isEmpty(transaction)) {
          return transaction;
        }

        const newTransaction = await saveNewTransaction(
          student,
          activeSession.session,
          bedDetails,
          transactionSession,
          conn
        );

        return newTransaction;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}
