const { NODE_ENV } = process.env;

export default (regNumber, conn) => {
  if (NODE_ENV === "development") {
    return _confirmStatusDevelopment(regNumber, conn);
  }
};

const _confirmStatusDevelopment = async (regNumber, conn) => {
  const student = await conn.models.StudentBio.findOne({
    regNumber: regNumber.toLowerCase(),
  });

  if (student) {
    return student;
  }

  return null;
};
