import bcrypt from "bcrypt";
const saltRounds = 10;

export default async (accountDetails, conn) => {
  try {
    const { email, password, accessLevel, name } = accountDetails;

    //we have a staff
    const staff = await conn.models.User.findOne({
      email: email.toLowerCase(),
    });
    if (staff) {
      throw `There is an account already registered with ${email}`;
    }
    //lets continue
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new conn.models.User({
      email: email.toLowerCase(),
      password: hash,
      accessLevel,
      userType: "staff",
      name: name,
      active: true,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
