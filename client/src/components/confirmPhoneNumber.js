import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { SendNotificationCode } from "../graphql/mutation";
import { ExtractError } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";
import styled from "styled-components";

const ConfirmPhoneNumberStyles = styled.div`
  .card-layout {
    margin-top: 5%;
  }
  .div-button {
    padding: 30px;
  }
  .center {
    margin: auto;
    width: 50%;
    border: 3px solid #5d8a8b;
    padding: 10px;
    margin-top: 7%;
  }
`;

const ConfirmPhoneNumber = (props) => {
  const [number, setNumber] = useState("");
  const { regNumber } = props.currentUser;
  const [codeObject, setCodeObject] = useState("");
  const [errors, setError] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  const [codeMutation, codeResult] = useMutation(SendNotificationCode);

  //check if the person already have a confirmation code sent to their phone

  useEffect(() => {
    if (codeResult.data) {
      setCodeObject(codeResult.data.phoneConfirmation);
      //we push our stuffs to where to input the code
      props.history.push("/confirm_code");
    }
    if (codeResult.error) {
      setSubmitted(false);
      setError(ExtractError(codeResult.error));
    }
    if (codeResult.data) {
      //update the dashboard state
    }
  }, [codeResult.data, codeResult.error]);

  const handlePhoneNumber = (e) => {
    const value = e.target.value;
    if (!value) return;
    setNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number) window.alert("please enter a phone number");
    setSubmitted(true);
    try {
      await codeMutation({
        variables: {
          regNumber: props.currentUser.regNumber,
          phoneNumber: number,
        },
      });
    } catch (error) {
      setSubmitted(false);
      console.log(error);
    }
  };

  return (
    <ConfirmPhoneNumberStyles>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <ErrorDisplay errors={errors} />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="card-layout">
              <form className="form-inline" onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                  <label htmlFor="staticPhone" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control-plaintext font-weight-bold"
                    id="staticPhone"
                    value="confirm your phone number"
                  />
                </div>
                <div className="form-group mx-sm-3 mb-2">
                  <label htmlFor="phoneNumber" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    onChange={handlePhoneNumber}
                    type="number"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Phone number"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitted}
                  className="btn btn-primary mb-2"
                >
                  {submitted
                    ? "sending confirmation code please wait...... "
                    : "phone number"}
                </button>
              </form>
            </div>
          </div>
          <div className="div-button text-center center">
            <p>
              If you have received a code you can proceed to enter the code.
            </p>
            <button
              className="btn btn-success"
              onClick={() => props.history.push("/confirm_code")}
            >
              proceed to enter code
            </button>
          </div>
        </div>
      </div>
    </ConfirmPhoneNumberStyles>
  );
};

export default ConfirmPhoneNumber;
