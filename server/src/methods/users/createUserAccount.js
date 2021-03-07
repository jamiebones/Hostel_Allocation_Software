import bcrypt from "bcrypt";
import models from "../../models"
const saltRounds = 10;

export default async (accountDetails) => {
  try {
    const { email, password, accessLevel } = accountDetails;

    //we have a staff
    const staff = await models.User.findOne({ email: email.toLowerCase() });
    if (staff) {
      throw `There is an account already registered with ${email}`;
    }
    //lets continue
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email: email.toLowerCase(),
      password: hash,
      accessLevel,
      userType: "staff",
    });
    newUser.save();
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

