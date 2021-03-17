export default async (roomIds, conn) => {
  //get the active session first
  const activeSession = await conn.models.SessionTable.findOne({
    active: true,
  });
  if (!activeSession) {
    throw new Error(
      "Please activate a session before you can send an sms to students"
    );
  }
  //loop through here and get the student phone numbers
  let receipentNumbers = "";
  roomIds.map(async (roomId) => {
    //BedSpaceAllocation
    const allocationArray = await conn.models.find({ roomId: roomId });
    //get the number from the array
    allocationArray.map(({ phoneNumber }) => {
      const number = `234${
        phoneNumber && phoneNumber.substr(1, phoneNumber.length)
      }`;
      receipentNumbers += ` ${number},`;
    });
  });
  if (receipentNumbers === "") {
    throw new Error("no phone numbers to send sms to");
  }
  return receipentNumbers;
};
