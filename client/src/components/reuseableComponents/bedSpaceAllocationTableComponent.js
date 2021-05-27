import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  InitiateHostelPayment,
  SimulateRemitaTransaction,
} from "../../graphql/mutation";
import { useMutation } from "@apollo/client";
//import ErrorDisplay from "./common/errorDisplay";
import { ExtractError, CapFirstLetterOfEachWord } from "../../modules/utils";
//import Loading from "./common/loading";
import { GiPersonInBed } from "react-icons/gi";
import { GiStopSign } from "react-icons/gi";
const BedSpaceStyles = styled.div`
  .resultBoard {
    display: flex;
    flex-direction: column;

    .btn-primary {
      background-color: #2b9dba;
      border-color: #2b9dba;
    }

    .text-success {
      font-weight: bold;
    }
  }
  table tr > td:nth-child(2) {
    text-align: right;
  }
  p {
    font-size: 20px;
    font-weight: 300;
  }

  .reserve-bed {
    margin-top: 20px;
    border: 1px solid green;
    padding: 20px;
    border-top: 10px solid rgb(54 74 65);
  }
  .reserve-details {
    background-color: #f3f2ed;
    margin: 20px;
    padding: 20px;
  }
  .iconClass {
    color: rgb(54 74 65);
  }
  .details-head {
    color: #0a7d1e;
    font-size: 1.5rems;
  }
  .iconClassRed {
    color: red;
  }
  .congrats {
    padding: 40px;
  }
  hr{
    border-top: 3px solid rgba(0,0,0,.1);
  }
`;

const BedSpaceAllocationTableComponent = ({ history, bedSpace, regNumber }) => {
  const [initPayment, initPaymentResult] = useMutation(InitiateHostelPayment);
  const [errors, setErrors] = useState(null);
  const [simulatedFunction, simulateResult] = useMutation(
    SimulateRemitaTransaction
  );
  useEffect(() => {
    if (initPaymentResult.error) {
      setErrors(initPaymentResult.error);
    }
    if (initPaymentResult.data) {
      //we have a successdul transaction
      const data = initPaymentResult.data.initiateHostelFeePayment;
      if (data !== null) {
        history.push("/make_payment", {
          error: initPaymentResult.error,
          transaction: data,
        });
      }
    }
  }, [initPaymentResult.data, initPaymentResult.error]);

  useEffect(() => {
    if (simulateResult.error) {
      setErrors(simulateResult.error);
    }
    if (simulateResult.data) {
      //we have a successdul transaction
      //const data = simulateResult.data.simulateRemitaTransaction;
      history.push("/student_transactions", {
        regNumber,
      });
    }
  }, [simulateResult.data, simulateResult.error]);

  const handleRemitaPayment = async (e) => {
    try {
      e.preventDefault();
      await initPayment({
        variables: {
          regNumber: regNumber,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSimulatedRemitaPayment = async (e) => {
    try {
      e.preventDefault();
      await simulatedFunction({
        variables: {
          regNumber: regNumber,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!bedSpace) {
    return null;
  }
  return (
    <BedSpaceStyles>
      <div className="resultBoard">
        <div className="text-center">
          {errors && (
            <div className="error-div">
              <GiStopSign size="1.5rem" className="iconClassRed" />{" "}
              <p className="lead text-danger">{errors.message}</p>
            </div>
          )}
        </div>

        {bedSpace && (
          <React.Fragment>
            <div className="text-center">
              <GiPersonInBed size="4.5rem" className="iconClass" />
            </div>
            <div className="reserve-bed">
              <div className="congrats">
                <p>
                  Congratulations! Your bid was successful. You can proceed to
                  make payment via the Remita Platform. Click the button below
                  to generate your RRR code. This bed space is reserved only for
                  24 hours.
                </p>
                <hr />
              </div>

              <div className="reserve-details">
                <p className="text-center details-head">Reserve Room Details</p>
                <p className="details-para">
                  Hostel/Hall
                  <span className="float-right details-span">
                    {CapFirstLetterOfEachWord(bedSpace.hallName)}
                  </span>
                </p>

                <p className="details-para">
                  Location
                  <span className="float-right details-span">
                    {CapFirstLetterOfEachWord(bedSpace.location)}
                  </span>
                </p>

                <p className="details-para">
                  Room Type
                  <span className="float-right details-span">
                    {CapFirstLetterOfEachWord(bedSpace.roomType)}
                  </span>
                </p>

                <p className="details-para">
                  Room Number
                  <span className="float-right details-span"></span>
                </p>

                <p className="details-para">
                  Bed
                  <span className="float-right details-span">
                    {bedSpace.bedNumber}
                  </span>
                </p>

                <p className="details-para">
                  Bed status
                  <span className="float-right details-span">
                    {bedSpace.bedStatus}
                  </span>
                </p>
              </div>

              <div className="text-center">
                {bedSpace.bedStatus !== "occupied" && (
                  <React.Fragment>
                    <div className="text-center">
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleRemitaPayment}
                        >
                          Make Payment
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleSimulatedRemitaPayment}
                        >
                          Simulate Remita Payment
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </BedSpaceStyles>
  );
};

export default BedSpaceAllocationTableComponent;
