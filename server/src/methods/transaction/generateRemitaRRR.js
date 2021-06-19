import studentBioMethod from "../studentBio";
import sessionTableMethod from "../sessionTable";
import bedSpaceMethod from "../bedspace";
import CryptoJS from "crypto-js";
import axios from "axios";
import config from "../../config"
var _ = require("lodash");

const { getStudentData } = studentBioMethod.common;
const { getActiveSession } = sessionTableMethod.common;
const { getReservedBedSpace, getReservedBedDetails } = bedSpaceMethod.common;
import {
  saveNewTransaction,
  updateTransactionWithRRR,
  checkTransactionAlreadyWithRRR,
} from "./transactionsUtil.js";

export default async function generateRemitaRRR(regNumber, conn) {
  const transactionSession = await conn.startSession();
  transactionSession.startTransaction();
  try {
    const activeSession = await getActiveSession(conn);
    const student = await getStudentData(regNumber, conn);
    if (!student) throw new Error("Student data not found");

    const bed = await getReservedBedSpace(
      regNumber,
      activeSession.session,
      conn
    );

    if (bed) {
      //save new transaction here
      const bedDetails = await getReservedBedDetails(bed.bedId, conn);
      const transaction = await checkTransactionAlreadyWithRRR(
        regNumber,
        activeSession.session,
        transactionSession,
        conn
      );

      if (!_.isEmpty(transaction)) {
        const { amount, rrr } = transaction;
        console.log("old transaction be called");
        let splitArray = amount.split(".");
        let splitAmount = splitArray[0].replace(",", "");
        await transactionSession.commitTransaction();
        return {
          statuscode: "",
          RRR: rrr,
          status: "",
          regNumber,
          amount: splitAmount,
        };
      }

      const newTransaction = await saveNewTransaction(
        student,
        activeSession.session,
        bedDetails,
        transactionSession,
        conn
      );
      //generate the rrr here
      const { amount, transactionId, payerName } = newTransaction;

      let splitArray = amount.split(".");
      let splitAmount = splitArray[0].replace(",", "");

      const data = _compileRemitaDataToSend({
        transactionId,
        total: splitAmount,
        email: student.email,
        phoneNumber: student.phoneNumber,
        name: payerName,
        bedDetails,
      });
      const remitaResponse = await _contactRemita(data);

      const { statuscode, RRR, status } = JSON.parse(remitaResponse);

      if (statuscode === "025" && RRR) {
        //save the rrr in the transaction object
        await updateTransactionWithRRR(
          newTransaction._id,
          RRR,
          transactionSession,
          conn
        );
        await transactionSession.commitTransaction();
        return { statuscode, RRR, status, regNumber, amount: splitAmount };
      }
    } else {
      throw new Error("you do not have a bed space on hold. ");
    }
  } catch (error) {
    await transactionSession.abortTransaction();
    console.log(error);
    throw error;
  } finally {
    transactionSession.endSession();
  }
}

const _generateHash = (msg) => {
  try {
    const messageHash = CryptoJS.SHA512(msg).toString();
    return messageHash;
  } catch (exception) {
    console.log(exception);
  }
};

const _compileRemitaDataToSend = ({
  transactionId,
  total,
  email,
  name,
  phoneNumber,
  bedDetails,
}) => {
  const {MerchantId,Api_Key, ServiceTypeId} = config.config
  const merchantId = MerchantId;
  const api_key = Api_Key;
  const serviceType = ServiceTypeId;

  const hash = _generateHash(
    merchantId + serviceType + transactionId + total + api_key
  );
  const data = {};

  data.amount = total;
  data.orderId = transactionId;
  data.serviceTypeId = serviceType;
  data.payerName = name;
  data.payerEmail = email;
  data.description = `PAYMENT FOR: ${
    bedDetails.bedSpace
  } IN ROOM ${bedDetails.roomNumber.toUpperCase()} IN ${bedDetails.hallName.toUpperCase()}`;
  data.payerPhone = phoneNumber;
  data.hash = hash;

  return data;
};

const _contactRemita = async (data) => {
  const {Gateway, MerchantId } = config.config;
  const gateway = Gateway;
  const merchantId = MerchantId;
  const apiHash = data.hash;

  delete data.hash;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`,
  };
  let response = await axios.post(
    gateway,

    data,

    {
      headers: headers,
    }
  );

  let jsonData = response.data;
  jsonData = jsonData.replace(")", "");
  jsonData = jsonData.replace("jsonp (", "");
  return jsonData;
};
