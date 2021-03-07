import util from "../../utils";
import models from "../../models";

const { NODE_ENV } = process.env;

export default (regNumber) => {
  //if (NODE_ENV === "development") {
    return _confirmStatusDevelopment(regNumber);
 // }
};

const _confirmStatusDevelopment = async (regNumber) => {
  const student = await models.StudentBio.findOne({
    regNumber: regNumber.toLowerCase()
  });

  if (student) {
    return student;
  }

  return null;
};
