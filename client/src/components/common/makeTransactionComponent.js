import React, { useEffect, useState } from "react";
import { CapFirstLetterOfEachWord } from "../../modules/utils";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { GenerateRemitaRRR } from "../../graphql/mutation";

import { ExtractError } from "../../modules/utils";
import ErrorDisplay from "./errorDisplay";
import date from "date-and-time";

const TransactionStyles = styled.div`
  p::after {
    content: <hr/>;
  }

  .invoice {
    position: relative;
    background: #fff;
    border: 1px solid #f4f4f4;
    padding: 20px;
    margin: 10px 25px;
  }
  .page-header {
    margin: 10px 0 20px 0;
    font-size: 22px;
  }
  
`;

const MakeTransactionComponent = ({ transaction, history }) => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  const {
    amount,
    transactionId,
    payerName,
    session,
    date: transactionDate,
    roomDetails: { hallName, bedSpace, roomNumber, location, roomType },
    student: { email, phoneNumber, regNumber },
  } = transaction;

  const pattern = date.compile("ddd, MMM DD YYYY");

  const [makeRRMutation, makeRRRMutationResult] = useMutation(
    GenerateRemitaRRR
  );

  useEffect(() => {
    if (makeRRRMutationResult.error) {
      setErrors(ExtractError(makeRRRMutationResult.error));
      setSubmitted(!submitted);
    }
    if (makeRRRMutationResult.data) {
      setSubmitted(!submitted);
      const {
        statuscode,
        RRR,
        status,
        regNumber,
        amount,
        env,
      } = makeRRRMutationResult.data.generateRemitaRRR;

      if (RRR) {
        //redirect to the page where we can make paymen
        history.push("/hostel_payment", {
          paymentDetails: {
            RRR,
            regNumber,
            amount,
            env,
          },
        });
      } else {
        setErrors(`RRR generation was not successfull: ${status}`);
      }
    }
  }, [makeRRRMutationResult.error, makeRRRMutationResult.data]);

  const handleRemitaPayment = async () => {
    try {
      setSubmitted(!submitted);
      await makeRRMutation({
        variables: {
          regNumber,
        },
      });
    } catch (error) {
      setSubmitted(!submitted);
      console.log(error);
    }
  };

  return (
    <TransactionStyles>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ErrorDisplay errors={errors} />
            <div className="card">
              <div className="card-body p-0">
                <div className="row p-5">
                  <div className="col-md-6">
                    <img src="http://via.placeholder.com/400x90?text=logo" />
                  </div>

                  <div className="col-md-6 text-right">
                    <p className="font-weight-bold mb-1">
                      Transaction Id {transactionId}
                    </p>
                    <p className="text-muted">Date: {transactionDate}</p>
                  </div>
                </div>

                <hr className="my-1" />

                <div className="row pb-5 p-5">
                  <div className="col-md-6">
                    <p className="font-weight-bold mb-4">Student Information</p>
                    <p className="mb-1">
                      {CapFirstLetterOfEachWord(payerName)}
                    </p>
                    <p>{regNumber.toUpperCase()}</p>
                    <p className="mb-1">{session}</p>
                  </div>

                  <div className="col-md-6 text-right">
                    <p className="font-weight-bold mb-4">Payment Details</p>
                    <p className="mb-1">
                      <span className="text-muted">Amount: </span> &#8358;
                      {amount}
                    </p>

                    <p className="mb-1">
                      <span className="text-muted">Payment type: </span> Bed
                      space
                    </p>
                  </div>
                </div>

                <div className="row p-5 mt-0">
                  <div className="col-md-6">
                    <p className="font-weight-bold mb-4">Room Details</p>

                    <p className="mb-1">
                      <span className="text-muted">Hall: </span>{" "}
                      {CapFirstLetterOfEachWord(hallName)}
                    </p>

                    <p className="mb-1">
                      <span className="text-muted">Location: </span>
                      {CapFirstLetterOfEachWord(location)}
                    </p>

                    <p className="mb-1">
                      <span className="text-muted">Room: </span> {roomNumber}
                    </p>

                    <p className="mb-1">
                      <span className="text-muted">Room Type: </span>
                      {CapFirstLetterOfEachWord(roomType)}
                    </p>

                    <p className="mb-1">
                      <span className="text-muted">Bed space : </span>
                      {CapFirstLetterOfEachWord(bedSpace)}
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-row-reverse bg-dark text-white p-1">
                  <div className="py-1 px-2 text-right">
                    <div className="h4 font-weight-light">&#8358;{amount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-center m-4">
          <button
            disabled={submitted}
            className="btn btn-primary"
            onClick={handleRemitaPayment}
          >
            {submitted ? "Generating rrr please wait....." : "Generate RRR"}
          </button>
        </div>
      </div>
    </TransactionStyles>
  );
};

export default MakeTransactionComponent;
