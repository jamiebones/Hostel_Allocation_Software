import axios from "axios";
const {
  CheapGlobalSmsGateway,
  CheapGlobalSmsSubAccount,
  CheapGlobalSmsSubAccountPassword,
} = process.env;

//http://cheapglobalsms.com/api_v1?sub_account=001_mysub1&sub_account_pass=pa55w0Rd&action=account_info

const checkSMSCredit = async () => {
  const creditRequest = await axios.get(
    `${CheapGlobalSmsGateway}?sub_account=${CheapGlobalSmsSubAccount}&sub_account_pass=${CheapGlobalSmsSubAccountPassword}&action=account_info&only_balance=1`
  );

  const response = creditRequest.data;

  if (response.error) {
    throw new Error(response.error);
  }
  return response;
};

const sendMessage = async ({ receipents, sender, message }) => {
  const smsRequest = await axios.get(
    `${CheapGlobalSmsGateway}?sub_account=${CheapGlobalSmsSubAccount}&sub_account_pass=${CheapGlobalSmsSubAccountPassword}&action=send_sms&sender_id=${sender}&message=${message}&recipients=${receipents}&type=0&route=1`
  );

  const response = smsRequest.data;

  if (response.error) {
    throw new Error(response.error);
  }
  const { batch_id, total } = response;
  return {
    status: "successful",
    totalMessage: total,
    batchId: batch_id,
  };
};

const getAmountSpent = async (batchId) => {
  const amountRequest = await axios.get(
    `${CheapGlobalSmsGateway}?sub_account=${CheapGlobalSmsSubAccount}&sub_account_pass=${CheapGlobalSmsSubAccountPassword}&action=get_total_units&batch_id=${batchId}`
  );
  const response = amountRequest.data;
  if (response.error) {
    throw new Error(response.error);
  }
  const { total } = response;
  return total;
};

const getSMSStatistics = async (batchId) => {
  const statsRequest = await axios.get(
    `${CheapGlobalSmsGateway}?sub_account=${CheapGlobalSmsSubAccount}&sub_account_pass=${CheapGlobalSmsSubAccountPassword}&action=get_delivery_stat&batch_id=${batchId}`
  );
  const response = statsRequest.data;
  if (response.error) {
    throw new Error(response.error);
  }
 
  const {
    UNDELIVERABLE,
    EXPIRED,
    REJECTED,
    FAILED,
    PENDING,
    ACCEPTED,
    DELIVERED,
    total,
  } = response;
  return {
    UNDELIVERABLE,
    EXPIRED,
    REJECTED,
    FAILED,
    PENDING,
    ACCEPTED,
    DELIVERED,
    total,
  };
};

export default {
  checkSMSCredit,
  sendMessage,
  getAmountSpent,
  getSMSStatistics,
};
