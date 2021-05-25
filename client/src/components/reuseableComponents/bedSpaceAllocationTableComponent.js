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
          {errors && <p className="lead text-danger">{errors.message}</p>}
        </div>
        {bedSpace && (
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col" colSpan="2" className="text-center">
                    <p className="lead">Reserve Room Details</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <p>Hostel/Hall</p>
                  </td>
                  <td>
                    <p>{CapFirstLetterOfEachWord(bedSpace.hallName)}</p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>Location</p>
                  </td>
                  <td>
                    <p>{CapFirstLetterOfEachWord(bedSpace.location)}</p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>Room Type</p>
                  </td>
                  <td>
                    <p>{CapFirstLetterOfEachWord(bedSpace.roomType)}</p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>Room Number</p>
                  </td>
                  <td>
                    <p className="text-success">{bedSpace.roomNumber}</p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>Bed</p>
                  </td>
                  <td>
                    <p className="text-success">
                      <b>{bedSpace.bedNumber}</b>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>Bed status</p>
                  </td>
                  <td>
                    <p>{bedSpace.bedStatus}</p>
                  </td>
                </tr>
              </tbody>
            </table>

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
                      className="btn btn-secondary btn-lg"
                      onClick={handleRemitaPayment}
                    >
                      Make Payment
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-lg"
                      onClick={handleSimulatedRemitaPayment}
                    >
                      Simulate Remita Payment
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    </BedSpaceStyles>
  );
};

export default BedSpaceAllocationTableComponent;
