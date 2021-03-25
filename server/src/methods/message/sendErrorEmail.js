const nodemailer = require("nodemailer");
const { DeveloperBugsEmailSupport, DeveloperBugsEmailPassword } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: DeveloperBugsEmailSupport,
    pass: DeveloperBugsEmailPassword,
  },
});

export const sendErrorMailToDeveloper = async (message) => {
  var mailOptions = {
    from: DeveloperBugsEmailSupport,
    to: DeveloperBugsEmailSupport,
    subject: "Bugs Report from UUHOSTEL",
    text: message,
  };
  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error send email to developer");
  }
};
