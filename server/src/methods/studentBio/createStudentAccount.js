import bcrypt from "bcrypt";
const saltRounds = 10;

const CreateNewStudentAccount = async (accountDetails, conn, session) => {
  const { regNumber, email, name, password } = accountDetails;
  //lets check if the student is already registered on the hostel platform
  const findStudentAccount = await conn.models.User.findOne({
    regNumber: regNumber.toLowerCase(),
  }).session(session);

  if (findStudentAccount) {
    throw new Error(
      "student already has an account on the portal. Please proceed to login."
    );
  }

  //create user account for the student
  const hash = await bcrypt.hash(password, saltRounds);
  const newUser = new conn.models.User({
    email: (email && email.toLowerCase()) || "",
    password: hash,
    regNumber,
    userType: "student",
    name: name,
  });
  await newUser.save({ session });
  return {
    regNumber,
  };
};

export default CreateNewStudentAccount;
