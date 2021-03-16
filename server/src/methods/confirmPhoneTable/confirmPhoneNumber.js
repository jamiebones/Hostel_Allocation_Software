import message from "../message";

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
  let msg = `your confirmation code is ${code}`;

  try {
    //await axios.post(api);
    //save the stuff to the database here
    const removeZeroFromNumber = number && number.substr(1, number.length);
    await message.CheapGlobalSMS.sendMessage({
      receipents: `234${removeZeroFromNumber}`,
      sender: "UU Hostel",
      message: msg,
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
