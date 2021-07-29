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
  p {
    font-size: 1.3rem;
  }
  .remita-panel {
    margin-top: 20px;
    border: 1px solid green;
    padding: 20px;
    border-top: 10px solid rgb(54 74 65);
  }
  .remita-logo {
    display: flex;
    justify-content: center;
  }
  .payment-details {
    background-color: #f3f2ed;
    margin: 20px;
    padding: 20px;
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
      <div className="row justify-content-center">
        <div className="col-6">
          <div className="remita-panel">
            <div className="payment-details">
              <form action={gateway} method="POST">
                <p>
                  Reg number:{" "}
                  <span className="font-weight-bold float-right">
                    {regNumber.toUpperCase()}
                  </span>
                </p>
                <p>
                  Amount :{" "}
                  <span className="font-weight-bold float-right">
                    &#8358;{amount}
                  </span>{" "}
                </p>
                <p>
                  RRR :{" "}
                  <span className="font-weight-bold float-right">{rrr}</span>
                </p>
                <p className="text-center">
                  <button
                    type="submit"
                    disabled={submitted}
                    className="btn btn-success"
                  >
                    {submitted
                      ? "redirecting to remita site"
                      : "Pay Via Remita"}
                  </button>
                </p>

                <input name="responseurl" value={returnUrl} type="hidden" />
                <input name="rrr" value={rrr} type="hidden" />
                <input name="hash" value={hash} type="hidden" />
                <input name="merchantId" value={merchantId} type="hidden" />
              </form>
            </div>
            <div className="remita-logo">
              <img src={remitaLogo} className="img img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </RemitaPaymentStyles>
  );
};

export default MakeRemitaPaymentUsingRRR;
