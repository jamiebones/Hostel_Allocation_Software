export const getStudentData = async (regNumber, conn) => {
  //lets get the data from cache before checking database
  const regToLower = regNumber.toLowerCase();
  const student = await conn.models.StudentBio.findOne({
    regNumber: regToLower,
  });
  return student;
};
