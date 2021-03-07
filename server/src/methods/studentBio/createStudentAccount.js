import bcrypt from "bcrypt";
const saltRounds = 10;

const CreateNewStudentAccount = async (
  accountDetails,
  models,
  session,
  config
) => {
  const {
    regNumber,
    email,
    name,
    dept,
    faculty,
    phoneNumber,
    entryMode,
    nextOfKin,
    currentLevel,
    currentSession,
    sex,
    profileImage,
    password,
  } = accountDetails;
  //lets check if the student is already registered on the hostel platform
  const findStudentAccount = await models.User.findOne({
    regNumber: regNumber.toLowerCase(),
  }).session(session);

  if (findStudentAccount) {
    throw new Error(
      "student already has an account on the portal. Please proceed to login."
    );
  }
  //save the newStudent data here
  const newStudent = new models.StudentBio({
    regNumber: regNumber.toLowerCase(),
    email,
    name,
    dept,
    faculty,
    phoneNumber,
    entryMode,
    nextOfKin,
    currentSession,
    currentLevel,
    sex,
    profileImage,
  });

  //await newStudent.save({ session });
  //create user account for the student
  const hash = await bcrypt.hash(password, saltRounds);
  const newUser = new models.User({
    email: (email && email.toLowerCase()) || "",
    password: hash,
    regNumber,
    userType: "student",
  });
  await newUser.save({ session });
  return {
    regNumber
  };
};

export default CreateNewStudentAccount;
