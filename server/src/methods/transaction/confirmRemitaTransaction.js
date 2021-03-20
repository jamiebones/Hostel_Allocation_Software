import axios from "axios";

import {
  findTransaction,
  markRoomAsOccupied,
  addUserToAllocatedBedSpace,
} from "./transactionsUtil";
import CryptoJS from "crypto-js";

import bedSpaceMethod from "../bedspace";


const {
  confirmSpaceOnHoldThatSession,
  checkAvailableSpace,
  incrementRoomStats,
  getLevelExplanation
} = bedSpaceMethod.common;

export default async function confirmTransaction(orderId, RRR, conn) {
  const transactionSession = await conn.startSession();
  transactionSession.startTransaction();
  try {
    const { MerchantId, Api_Key, CheckStatusUrl } = process.env;

    const hash = CryptoJS.SHA512(RRR + Api_Key + MerchantId).toString();

    const url = `${CheckStatusUrl}/${MerchantId}/${RRR}/${hash}/status.reg`;
    const response = await axios.get(url);
    //lets update the transaction here

    const transactionFunct = await findTransaction(
      orderId,
      transactionSession,
      conn
    );
    const transaction = transactionFunct();

    const { message, status } = response.data;

    console.log("response data", response.data);
    debugger;
    if (status === "01" || status === "00") {
      //we have a succesful transaction here
      if (transaction) {
        //we can confirm and give value here
        const {
          regNumber,
          session,
          roomDetails: { bedId },
        } = transaction;
        const checkAllocation = await confirmSpaceOnHoldThatSession(
          regNumber,
          session,
          transactionSession,
          conn
        );

        //homie already has a space
        if (checkAllocation) {
          transaction.successful = true;
          await transaction.save({ session: transactionSession });
          await transactionSession.commitTransaction();
          return { message, status };
        }

        //we can update the transaction here

        const [student] = await Promise.all([
          addUserToAllocatedBedSpace(transaction, transactionSession, conn),
          markRoomAsOccupied(bedId, transactionSession, conn),
        ]);

        transaction.successful = true;
        await transaction.save({ session: transactionSession });

        const levelType = getLevelExplanation({
          studentLevel: student.currentLevel,
          entryMode: student.entryMode,
          programDuration: student.programDuration,
        });

        let checkForSpace = await checkAvailableSpace({
          level: levelType,
          faculty: student.faculty,
          conn,
        });

        const { levelData, facultyData, sessionData } = checkForSpace();

        //this is called after payment
        await incrementRoomStats({
          levelData,
          facultyData,
          sessionData,
          session: transactionSession,
          conn,
        });
        await transactionSession.commitTransaction();
        return { message, status };
      }
    } else {
      await transactionSession.commitTransaction();
      return { message, status };
    }
  } catch (error) {
    await transactionSession.abortTransaction();
    console.log(error);
    throw error;
  } finally {
    transactionSession.endSession();
  }
}
