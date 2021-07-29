import models from "../models";

const SetTransactionId = () => {
  const date = new Date();
  const alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  let text = "";
  const components = [
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  ];
  for (let i = 0; i < 2; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  const id = components.join("");
  return id + text;
};

//payment module utils starts here

const FindTransaction = async (transactionId) => {
  const trans = await models.Transaction.findOne({ transactionId });
  if (trans) {
    return trans;
  }
  throw new Error("Transaction not found");
};

const FindTransactionFunction = async (transactionId) => {
  const trans = await models.Transaction.findOne({ transactionId });
  return () => {
    if (trans) {
      return trans;
    }
    throw new Error("Transaction not found");
  };
};

const MarkRoomAsOccupied = async (bedId) => {
  await models.BedSpace.updateOne(
    { _id: bedId },
    { $set: { bedStatus: "occupied" } }
  );
};

const AddUserToAllocatedBedSpace = async (transaction) => {
  const {
    session,
    payerId,
    roomDetails: { roomNumber, hallName, bedSpace, roomId, hallId },
  } = transaction;

  const student = await GetStudentData(payerId);

  const newbedSlot = new models.BedSpaceAllocation({
    hallId,
    hallName,
    roomId,
    studentId: student._id,
    session,
    regNumber: payerId,
    studentName: student.name,
    roomNumber,
    bedSpace,
  });

  newbedSlot.save();
  return student;
};

const roomStatusObject = {
  locked: "locked",
  occupied: "occupied",
  vacant: "vacant",
  reserved: "reserved",
  timeLocked: "timeLocked",
};

const convertStringArrayToLowerCase = (arr) => {
  let array;
  if (arr && arr.length){
    array = arr.map((item)=> {
      return item.toLowerCase();
    })
  }
  return array;
}

export default {
  SetTransactionId,
  MarkRoomAsOccupied,
  AddUserToAllocatedBedSpace,
  FindTransaction,
  FindTransactionFunction,
  roomStatusObject,
  convertStringArrayToLowerCase
};
