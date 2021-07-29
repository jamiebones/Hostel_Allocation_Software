import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ConfirmNotificationCode } from "../graphql/mutation";
import { CheckPhoneNumberConfirmation } from "../graphql/queries";
import { ExtractError } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";

import styled from "styled-components";

const ConfirmphoneStyles = styled.div`
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
    border-radius: 20px;
  }
  .div-grid {
    justify-content: space-around;
    align-items: baseline;
  }
  .label {
    margin-right: 10px;
  }
`;

const ConfirmPhoneCode = (props) => {
  const { regNumber } = props.currentUser;

  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorArray, setError] = useState([]);
  const [confirmCodeMutation, confirmCodeResult] = useMutation(
    ConfirmNotificationCode
  );

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (!value) return;
    setCode(value);
  };

  useEffect(() => {
    if (confirmCodeResult.data) {
      //push us to the dashboard
      const { confirmStatus } = confirmCodeResult.data.confirmCode;
      if (confirmStatus) {
        props.history.push("/dashboard", {
          confirmStatus: true,
        });
      }
    }

    if (confirmCodeResult.error) {
      setError(ExtractError(confirmCodeResult.error));
      setSubmitted(!submitted);
    }
  }, [confirmCodeResult.data, confirmCodeResult.error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      window.alert("confirmation code is required");
      return;
    }
    setSubmitted(!submitted);
    try {
      await confirmCodeMutation({
        variables: {
          code: code,
          regNumber: regNumber,
        },
        refetchQueries: [
          {
            query: CheckPhoneNumberConfirmation,
            variables: {
              regNumber,
            },
          },
        ],
      });
    } catch (error) {
      setSubmitted(!submitted);
    }
  };

  return (
    <ConfirmphoneStyles>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <h3>Enter confirmation code </h3>
            <ErrorDisplay errors={errorArray} />
          </div>

          <div className="div-button text-center center">
            <form onSubmit={handleSubmit}>
              <div
                className="d-flex justify-content-center 
          align-items-center form-group row"
              >
                <div className="col-md-12 d-flex div-grid">
                  <p className="label">enter confirmation code</p>
                  <div className="input-group mb-3">
                    <input
                      onChange={handleChange}
                      type="text"
                      className="form-control"
                      id="code"
                      placeholder="confirmation code"
                    />
                    <button
                      type="submit"
                      disabled={submitted ? true : false}
                      className="btn btn-primary mb-2"
                    >
                      {submitted
                        ? "sending confirmation code please wait...... "
                        : "Click to confirm"}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <p>
              If you have not received a code you can click below to try for
              another code.
            </p>
            <button
              className="btn btn-success"
              onClick={() => props.history.push("/dashboard")}
            >
              proceed to confirm your phone number
            </button>
          </div>

          {/* <div className="d-flex justify-content-center align-items-center">
            <div className="card-layout">
              <form className="form-inline" onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                  <label htmlFor="staticPhone" className="sr-only">
                    Enter confirmation code
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control-plaintext font-weight-bold"
                    id="staticPhone"
                    value="enter confirmation code"
                  />
                </div>
                <div className="form-group mx-md-3 mb-2">
                  <label htmlFor="phoneNumber" className="sr-only">
                    Confirmation Code
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id="code"
                    placeholder="confirmation code"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitted ? true : false}
                  className="btn btn-primary mb-2"
                >
                  {submitted
                    ? "sending confirmation code please wait...... "
                    : "Click to confirm"}
                </button>
              </form>
            </div>
          </div> 
          <div className="div-button text-center center">
            <p>
              If you have not received a code you can click below to try for
              another code.
            </p>
            <button
              className="btn btn-info"
              onClick={() => props.history.push("/dashboard")}
            >
              proceed to confirm your phone number
            </button>
          </div>
          */}
        </div>
      </div>
    </ConfirmphoneStyles>
  );
};

export default ConfirmPhoneCode;
