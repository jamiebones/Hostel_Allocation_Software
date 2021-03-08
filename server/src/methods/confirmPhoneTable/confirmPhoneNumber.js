import axios from "axios";
import models from "../../models";

const { SMS_API, SMS_Token } = process.env;

const _setCode = () => {
  const date = new Date();
  const alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  let text = "";
  const components = [date.getDate(), date.getHours(), date.getSeconds()];
  for (let i = 0; i < 2; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  const id = components.join("");
  return id + text;
};

export default async ({ number, regNumber, conn }) => {
  const code = _setCode();
  const from = "Uniuyo Hostel Portal";
  const to = number;
  let msg = `your confirmation code is ${code}`;

  try {
    //await axios.post(api);
    //save the stuff to the database here
    await axios.post(SMS_API, null, {
      params: {
        api_token: SMS_Token,
        from,
        to,
        body: msg,
        dnd: 4,
      },
    });

    let phoneCodeObject = {
      randomCode: code,
      confirmStatus: false,
      regNumber,
      timeSaved: Date.now(),
      phoneNumber: number,
    };
    const newConfirmTable = new conn.models.ConfirmPhoneNumber(phoneCodeObject);
    await newConfirmTable.save();
    return newConfirmTable;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
