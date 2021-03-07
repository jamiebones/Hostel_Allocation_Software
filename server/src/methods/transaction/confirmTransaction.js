
import axios from "axios";
const { runInTransaction } = require("mongoose-transact-utils");
import {
  findTransaction,
  markRoomAsOccupied,
  addUserToAllocatedBedSpace,
} from "./transactionsUtil";

import bedSpaceMethod from "../bedspace";

const {
  confirmSpaceOnHoldThatSession,
  checkAvailableSpace,
  incrementRoomStats,
} = bedSpaceMethod.common;

export default async function confirmTransaction(flutterId, transId) {
  return await runInTransaction(async (transactionSession) => {
    try {
      const { Flutter_Secret_Key, Flutter_VerifyUrl } = process.env;
      const url = `${Flutter_VerifyUrl}${flutterId}/verify`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Flutter_Secret_Key}`,
        },
      });
      //lets update the transaction here
      
      const transactionFunct = await findTransaction(
        transId,
        transactionSession
      );
      const transaction = transactionFunct();

      if (response.data.error === "error") {
        throw new Error(response.data.message);
      }
      const {
        data: {
          tx_ref,
          currency,
          amount_settled,
          status,
          customer: { name, phone_number, email },
        },
      } = response.data;

      if (status === "successful") {
        if (transaction) {
          const splitArray = transaction.amount.split(".");
          let reformedAmount = splitArray[0].replace(",", "");
          if (+amount_settled >= +reformedAmount) {
            //we are good here
          } else {
            //you paid less
            throw new Error(
              `your payment was less than the required amount of ${transaction.amount}. You are on your own`
            );
          }
          //check the currency used for payment
          if (currency !== "NGN") {
            throw new Error(`only naira payment accepted here`);
          }
          //we can confirm and give value here
          const {
            regNumber,
            session,
            roomDetails: { bedId },
          } = transaction;
          const checkAllocation = await confirmSpaceOnHoldThatSession(
            regNumber,
            session,
            transactionSession
          );

          //homie already has a space
          if (checkAllocation) {
            transaction.paymentId = flutterId;
            transaction.successful = true;
            await transaction.save({ session: transactionSession });
            return transaction;
          }

          //we can update the transaction here

          const [student] = await Promise.all([
            addUserToAllocatedBedSpace(transaction, transactionSession),
            markRoomAsOccupied(bedId, transactionSession),
          ]);

          transaction.paymentId = flutterId;
          transaction.successful = true;
          await transaction.save({ session: transactionSession });

          const { levelType, faculty } = student;

          let checkForSpace = await checkAvailableSpace({
            level: levelType,
            faculty: faculty,
          });

          const { levelData, facultyData, sessionData } = checkForSpace();

          //this is called after payment
          await incrementRoomStats({
            levelData,
            facultyData,
            sessionData,
            session: transactionSession,
          });

          return transaction;
        }
      } else {
        throw new Error(`Transaction was not successful`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}
