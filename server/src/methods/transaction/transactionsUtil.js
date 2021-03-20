import studentBioMethod from "../studentBio";
const date = require("date-and-time");

const { getStudentData } = studentBioMethod.common;

export const findTransaction = async (transactionId, session, conn) => {
  const trans = await conn.models.Transaction.findOne({
    transactionId,
  }).session(session);
  return () => {
    if (trans) {
      return trans;
    }
    throw new Error("Transaction not found");
  };
};

export const addUserToAllocatedBedSpace = async (
  transaction,
  transactionSession,
  conn
) => {
  const {
    session,
    regNumber,
    roomDetails: { roomNumber, hallName, bedSpace, roomId, hallId },
  } = transaction;

  const student = await getStudentData(regNumber, conn);

  const newbedSlot = new conn.models.BedSpaceAllocation({
    hallId,
    hallName,
    roomId,
    studentId: student._id,
    session,
    regNumber,
    studentName: student.name,
    roomNumber,
    bedSpace,
  });

  await newbedSlot.save({ session: transactionSession });
  return student;
};

export const markRoomAsOccupied = async (bedId, transactionSession, conn) => {
  await conn.models.BedSpace.updateOne(
    { _id: bedId },
    { $set: { bedStatus: "occupied" } }
  ).session(transactionSession);
};

export const checkForBedspaceReservation = async (regNumber, session, conn) => {
  const now = new Date();
  let yesterday = date.addDays(now, -1);
  const bedReserved = await conn.models.OnHoldBed.findOne({
    session: session,
    regNumber: regNumber,
    lockStart: { $gte: yesterday },
  });
  //we still have a reservation lets
  if (bedReserved) {
    //check transaction if we have an existing transaction
    return bedReserved;
  } else {
    throw new Error(
      "you do not have a hostel bed reservation. You can not effect payment"
    );
  }
};

export const saveNewTransaction = async (
  student,
  session,
  bed,
  transactionSession,
  conn
) => {
  const { regNumber, name } = student;
  const amount = await getHostelFee({
    regNumber: regNumber,
    bedId: bed._id,
    session,
    transactionSession,
    conn,
  });
  if (!amount) throw new Error("Hostel fee is required");
  const transactionId = _setTransactionId();
  const payerName = name;
  const date = new Date();
  const roomDetails = {
    roomNumber: bed.roomNumber,
    hallName: bed.hallName,
    bedSpace: bed.bedNumber,
    roomNumber: bed.roomNumber,
    roomId: bed.roomId,
    hallId: bed.hallId,
    location: bed.location,
    roomType: bed.roomType,
    bedId: bed._id,
  };

  const successful = false;
  const newTransaction = new conn.models.Transaction({
    session,
    amount,
    transactionId,
    regNumber: regNumber,
    payerName,
    date,
    roomDetails,
    successful,
  });
  await newTransaction.save({ session: transactionSession });
  return newTransaction;
};

export const updateTransactionWithRRR = async (
  transId,
  rrr,
  transactionSession,
  conn
) => {
  await conn.models.Transaction.updateOne(
    { _id: transId },
    { transactionStatus: "025", rrr: rrr }
  ).session(transactionSession);

  return true;
};

export const getHostelFee = async ({
  regNumber,
  bedId,
  session,
  transactionSession,
  conn,
}) => {
  //bedspace on hold that the person wants to pay for
  const spaceOnHold = await conn.models.OnHoldBed.findOne({
    bedId: bedId,
    regNumber: regNumber,
    session: session,
  }).lean().session(transactionSession);

  if (spaceOnHold) {
    const bed = await conn.models.BedSpace.findById(bedId).session(
      transactionSession
    );
    const hallId = bed && bed.hallId;
    //get the associated hall and return the hostel fees associated with it
    const hostel = await conn.models.Hostel.findOne({ _id: hallId })
      .lean()
      .session(transactionSession);

    const fees = hostel && hostel.hostelFee;
    return fees;
  }

  return null;
};

const _setTransactionId = () => {
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

export const checkTransactionAlreadyWithRRR = async (
  regNumber,
  session,
  transactionSession,
  conn
) => {
  const transaction = await conn.models.Transaction.findOne({
    regNumber: regNumber,
    session: session,
    rrr: { $exists: true, $ne: null },
    successful: false,
  }).session(transactionSession);

  return transaction;
};
