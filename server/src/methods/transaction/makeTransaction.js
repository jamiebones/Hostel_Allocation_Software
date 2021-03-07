import studentBioMethod from "../studentBio";
import sessionTableMethod from "../sessionTable";
import bedSpaceMethod from "../bedspace";
const { runInTransaction } = require("mongoose-transact-utils");

const { getStudentData } = studentBioMethod.common;
const { getActiveSession } = sessionTableMethod.common;
const { getReservedBedSpace, getReservedBedDetails } = bedSpaceMethod.common;
import {
  saveNewTransaction,
  checkTransactionAlreadyWithRRR,
} from "./transactionsUtil.js";

var _ = require('lodash');


export default async function makeTransaction(regNumber) {
  return await runInTransaction(async (transactionSession) => {
    try {
      const activeSession = await getActiveSession();
      const student = await getStudentData(regNumber);

      if (!student) throw new Error("Student data not found");

      const bed = await getReservedBedSpace(regNumber, activeSession.session);

      if (bed) {
        //save new transaction here
        const bedDetails = await getReservedBedDetails(bed.bedId);
        //check if there is already a transaction

        const transaction = await checkTransactionAlreadyWithRRR(
          regNumber,
          activeSession.session,
          transactionSession
        );

        if (!_.isEmpty(transaction)) {
          return transaction;
        }

        const newTransaction = await saveNewTransaction(
          student,
          activeSession.session,
          bedDetails,
          transactionSession
        );

        return newTransaction;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}
