import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        return {
          type: "CouldNotFindAccountError",
          message: `Could not find account: ${reg}`,
        };
      }
      const match = await bcrypt.compare(password, student.password);
      if (!match) {
        //return error to user to let them know the password is incorrect
        return {
          type: "InCorrectCredential",
          message: `Incorrect credentials`,
        };
      }

      if (student.active === false) {
        return {
          type: "Account InActive",
          message: `your account is inactive`,
        };
      }

      const token = jwt.sign(
        {
          regNumber: student.regNumber,
          id: student.id,
          userType: student.userType,
          name: student.name,
          accessLevel: student.accessLevel,
          active: student.active,
        },
        config.secret
      );

      return {
        regNumber: regNumber,
        id: student.id,
        token: token,
        userType: student.userType,
        name: student.name,
        accessLevel: student.accessLevel,
        active: student.active,
      };
    }

    //we have a staff member here
    if (emailAddress) {
      //find the account
      const staff = await conn.models.User.findOne({ email: emailAddress });
      if (!staff) {
        return {
          type: "AccountNotAvaliable",
          message: `Could not find account: ${emailAddress}`,
        };
      }
      //check the userType
      if (staff.userType == "student")
        return {
          type: "NotAuthorised",
          message: `please use your reg number to login`,
        };

      const match = await bcrypt.compare(password, staff.password);
      if (!match) {
        //return error to user to let them know the password is incorrect
        return {
          type: "InCorrectCredential",
          message: `Incorrect credentials`,
        };
      }

      if (staff.active === false) {
        return {
          type: "Account InActive",
          message: `your account is in active`,
        };
      }

      const token = jwt.sign(
        {
          email: staff.email,
          id: staff.id,
          userType: staff.userType,
          accessLevel: staff.accessLevel,
          name: staff.name,
          active: staff.active,
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
        active: staff.active,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
