import React, { useEffect, useState } from "react";
//import { CapFirstLetterOfEachWord } from "../modules/utils";

//import { GenerateRemitaRRR } from "../graphql/mutation";

import CryptoJS from "crypto-js";

import styled from "styled-components";
import remitaLogo from "../images/remita-payment-logo-horizonal.png";

const RemitaPaymentStyles = styled.div`
  .div-panelPayment {
    p {
      font-size: 20px;
      font-weight: 300;
    }

    p::after {
      content: <hr/>;
    }

    p > span {
      float: right;
    }
  }
`;

const MakeRemitaPaymentUsingRRR = ({ history, location }) => {
  const [submitted, setSubmitted] = useState(false);
  const [hash, setHash] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [rrr, setRRR] = useState("");
  const [amount, setAmount] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [gateway, setGateway] = useState("");
  const [returnUrl, setReturnUrl] = useState("");

  const { paymentDetails } = location && location.state;
  console.log(paymentDetails);
  useEffect(() => {
    if (paymentDetails) {
      const {
        RRR,
        regNumber,
        amount,
        env: {
          MerchantId,
          Api_Key,
          CheckStatusUrl,
          ReturnRemitaUrl,
          RRRGateWayPaymentUrl,
        },
      } = paymentDetails;

      const hash = CryptoJS.SHA512(MerchantId + RRR + Api_Key).toString();
      setHash(hash);
      setApiKey(Api_Key);
      setMerchantId(MerchantId);
      setRRR(RRR);
      setAmount(amount);
      setRegNumber(regNumber);
      setGateway(RRRGateWayPaymentUrl);
      setReturnUrl(ReturnRemitaUrl);
    } else {
      //push to
      history.push("/dashboard");
    }
  }, []);

  return (
    <RemitaPaymentStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3 mt-5">
          <div className="div-panelPayment">
            <form action={gateway} method="POST">
              <p>
                Reg number:{" "}
                <span className="font-weight-bold">
                  {regNumber.toUpperCase()}
                </span>
              </p>
              <p>
                Amount :{" "}
                <span className="font-weight-bold">&#8358;{amount}</span>{" "}
              </p>
              <p>
                RRR : <span className="font-weight-bold">{rrr}</span>
              </p>
              <p className="text-center">
                <button
                  type="submit"
                  disabled={submitted}
                  className="btn btn-success"
                >
                  {submitted ? "redirecting to remita site" : "Pay Via Remita"}
                </button>
              </p>
              <p className="mt-3">
                <img src={remitaLogo} className="img img-fluid" />
              </p>
              <input name="responseurl" value={returnUrl} type="hidden" />
              <input name="rrr" value={rrr} type="hidden" />
              <input name="hash" value={hash} type="hidden" />
              <input name="merchantId" value={merchantId} type="hidden" />
            </form>
          </div>
        </div>
      </div>
    </RemitaPaymentStyles>
  );
};

export default MakeRemitaPaymentUsingRRR;
