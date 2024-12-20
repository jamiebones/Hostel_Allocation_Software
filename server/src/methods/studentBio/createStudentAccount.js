import bcrypt from "bcrypt";
const saltRounds = 10;

const CreateNewStudentAccount = async (accountDetails, conn) => {
  const session = await conn.startSession();
  session.startTransaction();
  try {
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
    await conn.models.User.create(
      [
        {
          email: (email && email.toLowerCase()) || "",
          password: hash,
          regNumber,
          userType: "student",
          accessLevel: "normal",
          name: name,
          active: true
        },
      ],
      { session }
    );
    await session.commitTransaction();
    return {
      regNumber,
    };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default CreateNewStudentAccount;
