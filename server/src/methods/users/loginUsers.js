import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server";

export default async (userDetails, { conn, config }) => {
  try {
    const { email, password, regNumber } = userDetails;
    let emailAddress = email && email.toLowerCase();
    let reg = regNumber && regNumber.toLowerCase();

    if (reg) {
      //we have a student
      //find the account
      const student = await conn.models.User.findOne({
        regNumber: { $regex: reg, $options: "i" },
      });
      if (!student) {
        throw new UserInputError(`Could not find account: ${reg}`);
      }
      const match = await bcrypt.compare(password, student.password);
      if (!match) {
        //return error to user to let them know the password is incorrect
        throw new AuthenticationError(`Incorrect credentials`);
      }

      const token = jwt.sign(
        {
          regNumber: student.regNumber,
          id: student.id,
          email: student.email,
          userType: student.userType,
          name: student.name,
        },
        config.secret
      );

      return {
        regNumber: regNumber,
        id: student.id,
        token: token,
        email: student.email,
        userType: student.userType,
        name: student.name,
      };
    }

    //we have a staff member here
    if (emailAddress) {
      //find the account
      const staff = await conn.models.User.findOne({ email: emailAddress });
      if (!staff) {
        throw new UserInputError(`Could not find account: ${emailAddress}`);
      }
      //check the userType
      if (staff.userType == "student")
        throw new Error(`please use your reg number to login`);
      const match = await bcrypt.compare(password, staff.password);
      if (!match) {
        //return error to user to let them know the password is incorrect
        throw new AuthenticationError(`Incorrect credentials`);
      }

      const token = jwt.sign(
        {
          email: staff.email,
          id: staff.id,
          userType: staff.userType,
          accessLevel: staff.accessLevel,
          name: staff.name
        },
        config.secret
      );

      return {
        email: staff.email,
        id: staff.id,
        userType: staff.userType,
        accessLevel: staff.accessLevel,
        name: staff.name,
        token: token,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
