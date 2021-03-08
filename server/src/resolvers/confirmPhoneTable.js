import methods from "../methods";

export default {
  Query: {
    confirmIfPhone: async (parent, { regNumber }, { fastConn, slowConn }) => {
      const regNumberToLower = regNumber && regNumber.toLowerCase();
      const phoneConfirmed = await fastConn.models.ConfirmPhoneNumber.findOne({
        regNumber: regNumberToLower,
        confirmStatus: true,
      });
      if (phoneConfirmed) {
        //return here
        return true;
      } else {
        return false;
      }
    },
    checkPhoneEnteredMoreThanThreeTimes: async (
      parent,
      { regNumber },
      { fastConn, slowConn }
    ) => {
      const regNumberToLower = regNumber && regNumber.toLowerCase();
      const timesEntered = await slowConn.models.ConfirmPhoneNumber.countDocuments(
        {
          regNumber: regNumberToLower,
          confirmStatus: false,
        }
      ).exec();
      return timesEntered.toString();
    },
  },
  Mutation: {
    phoneConfirmation: async (
      parent,
      { regNumber, phoneNumber },
      { fastConn, slowConn }
    ) => {
      try {
        //check if phone number has been registered before
        const findPhone = await fastConn.models.ConfirmPhoneNumber.findOne({
          phoneNumber: phoneNumber,
          confirmStatus: true,
        });
        if (findPhone) {
          throw new Error(`${phoneNumber} has already been registered.`);
        }
        const obj = {
          number: phoneNumber,
          regNumber,
        };

        //check if the person have more than three false confirmation
        const regNumberToLower = regNumber && regNumber.toLowerCase();
        const timesEntered = await slowConn.models.ConfirmPhoneNumber.countDocuments(
          {
            regNumber: regNumberToLower,
            confirmStatus: false,
          }
        ).exec();
        if (timesEntered == 3) {
          throw new Error(
            `you have reached the maximum phone number confirmation. Please contact the Student Affairs to have your phone number confirmed before proceeding further. Thank you`
          );
        }

        const data = await methods.confirmPhoneMethod.confirmPhoneNumber(
          obj,
          fastConn
        );
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    confirmCode: async (parent, { regNumber, code }, {fastConn, slowConn }) => {
      try {
        const findCode = await fastConn.models.ConfirmPhoneNumber.findOne({
          randomCode: { $regex: code, $options: "i" },
          regNumber: { $regex: regNumber, $options: "i" },
          confirmStatus: false,
        });

        if (findCode) {
          //lets update it here
          findCode.confirmStatus = true;
          const phoneNumber = findCode.phoneNumber;
          const [data] = await Promise.all([
            findCode.save(),
            fastConn.models.StudentBio.updateOne(
              { regNumber: { $regex: regNumber, $options: "i" } },
              { $set: { phoneNumber: phoneNumber } }
            ),
          ]);
          return data;
        }
        throw new Error(`${code} is not a valid code.`);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
