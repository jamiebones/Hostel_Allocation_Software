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
  for (let i = 0; i < roomIds.ids.length; i++) {
    const roomId = roomIds.ids[i];
    //BedSpaceAllocation
    const allocationArray = await conn.models.BedSpaceAllocation.find({
      roomId: roomId,
    }).lean();
    allocationArray.map(({ phoneNumber }) => {
      if (phoneNumber) {
        const number = `234${
          phoneNumber && phoneNumber.substr(1, phoneNumber.length)
        }`;
        receipentNumbers += ` ${number},`;
      }
    });
  }
  
  if (receipentNumbers == "") {
    throw new Error("no phone numbers to send sms to");
  }
  return receipentNumbers;
};
