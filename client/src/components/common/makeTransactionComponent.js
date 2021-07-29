import React, { useEffect, useState } from "react";
import { CapFirstLetterOfEachWord } from "../../modules/utils";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { GenerateRemitaRRR } from "../../graphql/mutation";

import { ExtractError } from "../../modules/utils";
import ErrorDisplay from "./errorDisplay";
import dayjs from "dayjs";
import uniuyologo from "../../images/uniuyologo.jpg";

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
  .image-div {
    p {
      font-size: 1.3rem;
      line-height: 10px;
    }
    img{
      width: 180px;
    }
  }
  .uniuyo-address {
    padding: 15px 20px;
  }
  .container-border {
    border: 1px solid #487924;
    padding: 10px;
    border-top: 10px solid rgb(54 74 65);
  }

  hr {
    border-top: 4px solid rgba(0, 0, 0, 0.1);
  }
  .para-details {
    margin-left: 60px;
    font-size: 1.3rem;
  }
  .para1 {
    margin-top: 40px;
  }
  .para2 {
  }
  .student-details {
    font-size: 1.1rem;

    span {
      padding-left: 10px;
    }
  }
  .btn{
    border-radius: 80px;
  }
`;

const MakeTransactionComponent = ({ transaction, history }) => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState(null);

  const {
    amount,
    transactionId,
    payerName,
    session,
    date: transactionDate,
    roomDetails: { hallName, bedSpace, roomNumber, location, roomType },
    student: { email, phoneNumber, regNumber },
  } = transaction;

  const [makeRRMutation, makeRRRMutationResult] =
    useMutation(GenerateRemitaRRR);

  useEffect(() => {
    if (makeRRRMutationResult.error) {
      setErrors(makeRRRMutationResult.error);
      setSubmitted(!submitted);
    }
    if (makeRRRMutationResult.data) {
      setSubmitted(!submitted);
      const { statuscode, RRR, status, regNumber, amount, env } =
        makeRRRMutationResult.data.generateRemitaRRR;

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
      console.log(error);
    }
  };

  return (
    <TransactionStyles>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              {errors && <p className="lead text-danger">{errors.message}</p>}
            </div>
          </div>
          <div className="container container-border">
            <div className="row">
              <div className="col-6 image-div">
                <img src={uniuyologo} className="rounded-circle" />
                <div className="uniuyo-address">
                  <p>University of Uyo</p>
                  <p>Student Affairs Division</p>
                  <p>Uyo</p>
                </div>
              </div>
              <div className="col-1"></div>
              <div className="col-4">
                <p className="para-details para1">
                  Transaction ID:
                  <span className="float-right">{transactionId}</span>
                </p>

                <p className="para-details para2">
                  Transaction Date:
                  <span className="float-right">
                    {dayjs(transactionDate).format("YYYY MM-DD")}
                  </span>
                </p>
              </div>

              <div className="col-1"></div>
              <div className="col-12">
                <hr />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p className="lead text-center font-weight-bold mb-4">Payment For Bed Space</p>

                <p className="lead">Student Details</p>

                <p className="student-details">
                  Name:
                  <span className="text-muted float-right">
                    {CapFirstLetterOfEachWord(payerName)}
                  </span>
                </p>

                <p className="student-details">
                  Reg Number:
                  <span className="text-muted float-right">
                    {regNumber.toUpperCase()}
                  </span>
                </p>
                <p className="student-details">
                  Session:{" "}
                  <span className="text-muted float-right">{session}</span>
                </p>
                <hr />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p className="lead text-center font-weight-bold mb-4">Bed Space Details</p>

                <p>
                  <span className="text-muted float-right">Hall: </span>
                  {CapFirstLetterOfEachWord(hallName)}
                </p>

                <p>
                  <span className="text-muted float-right">Location: </span>
                  {CapFirstLetterOfEachWord(location)}
                </p>

                <p>
                  <span className="text-muted float-right">Room: </span>{" "}
                  {roomNumber}
                </p>

                <p>
                  <span className="text-muted float-right">Room Type: </span>
                  {CapFirstLetterOfEachWord(roomType)}
                </p>

                <p>
                  <span className="text-muted float-right">Bed space : </span>
                  {CapFirstLetterOfEachWord(bedSpace)}
                </p>

                <hr />

                <div className="d-flex flex-row-reverse bg-dark text-white p-1">
                  <div className="py-1 px-2 text-center">
                    <div className="h4 font-weight-light">&#8358;{amount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="text-center m-4">
              <button
                disabled={submitted}
                className="btn btn-primary btn-lg"
                onClick={handleRemitaPayment}
              >
                {submitted ? "Generating rrr please wait....." : "Generate RRR"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransactionStyles>
  );
};

export default MakeTransactionComponent;
