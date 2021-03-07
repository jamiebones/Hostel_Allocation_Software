import models from "../../models";
import config from "../../config/";

export const getStudentData = async (regNumber) => {
  //lets get the data from cache before checking database
  const regToLower = regNumber.toLowerCase();
  let cachedStudent = await config.redisClient.getAsync(regToLower);
  if (cachedStudent) {
    let student = JSON.parse(cachedStudent);
    return student;
  }
  const student = await models.StudentBio.findOne({ regNumber: regToLower });
  return student;
};
