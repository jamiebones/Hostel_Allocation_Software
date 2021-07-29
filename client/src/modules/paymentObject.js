import { Flutter_Pub_Key } from "./utils";

const PaymentObject = (paymentObject) => {
  const {
    transactionId,
    amount,
    regNumber,
    email,
    phone_number,
    name,
  } = paymentObject;
  const payment = {
    public_key: Flutter_Pub_Key,
    tx_ref: transactionId,
    amount: amount,
    currency: "NGN",
    payment_options: "card, barter, ussd",
    // specified redirect URL
    redirect_url: "http://localhost:3000/confirm_payment",
    meta: { consumer_id: regNumber },
    customer: { email: email, phone_number: phone_number, name: name },
    callback: function (data) {
      console.log(data);
    },
    customizations: {
      title: "Uniuyo Hostel Payment",
      description: "Payment for hostel space",
      logo: "https://assets.piedpiper.com/logo.png",
    },
  };
  return payment;
};

export { PaymentObject };
