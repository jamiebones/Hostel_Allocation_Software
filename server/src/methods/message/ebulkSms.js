import axios from "axios";
import config from "../../config"
const { EBulkSMSAPIKey, EBulkSMSUsername, EBulkSMSGateWay } = config.config;

//https://api.ebulksms.com:4433/sendsms?username={your_email_address}&api
//key={your_api_key}&sender={your_sender_name}&messagetext={your_message_
//here}&flash=0&recipients=23480...,23470...

const sendMessage = async ({ sender, recipients, message }) => {
  try {
    const sentMessage = await axios.get(
      `${EBulkSMSGateWay}/sendsms?username=${EBulkSMSUsername}&apikey=${EBulkSMSAPIKey}&sender=${sender}&messagetext=${message}&flash=0&recipients=${recipients}`
    );
    console.log("sent message is a : ", sentMessage.data);
    let splitResponse = sentMessage.data.split("|");
    let obj = {
      status: splitResponse[0],
      totalMessage: splitResponse[1].split(":")[1],
      smsCost: splitResponse[2].split(":")[1],
    };

    //SUCCESS|totalsent:1|cost:1

    return obj;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getCredits = async () => {
  try {
    try {
      const creditResponse = await axios.get(
        `${EBulkSMSGateWay}/balance/${EBulkSMSUsername}/${EBulkSMSAPIKey}`
      );
      console.log("credit response is what again: ", creditResponse.data);
      return {
        sms_credits: creditResponse.data,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  } catch (error) {}
};

export default {
  sendMessage,
  getCredits,
};
