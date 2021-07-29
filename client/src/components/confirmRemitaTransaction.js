import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";

import { ConfirmTransactionUsingRRR } from "../graphql/queries";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";
const queryString = require("query-string");

const ConfirmTransactionStyles = styled.div`
  .transaction-card{
    border: 1px solid green;
    padding: 40px;
    border-top: 10px solid rgb(54 74 65);
    margin-top: 20px;
  }


`;

const ConfirmRemitaTransaction = ({ location, history }) => {
  const [errors, setErrors] = useState("");
  const [statusmessage, setStatusMessage] = useState(null);
  const parsed = queryString.parse(location.search);
  const { RRR, orderID } = parsed;
  const { loading, error, data } = useQuery(ConfirmTransactionUsingRRR, {
    variables: {
      orderID,
      RRR,
    },
  });

  useEffect(() => {
    if (!RRR) {
      setErrors([{ message: "There is no transaction to confirm." }]);
      history.push("/dashboard");
    } else {
      //we call the lazyquery here
    }
  }, []);

  useEffect(() => {
    if (data) {
      const { message, status } = data.confirmTransactionUsingRRR;
      setStatusMessage({ message, status });
    }
    if (error) {
      setErrors(ExtractError(error));
    }
  }, [data, error]);

  return (
    <ConfirmTransactionStyles>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card transaction-card">
            <h5 className="card-header text-center">Transaction Status</h5>
            <div className="card-body">
              <ErrorDisplay errors={errors} />
              {statusmessage && (
                <React.Fragment>
                  <h5 className="card-title text-center text-info">
                    {statusmessage && statusmessage.message}
                  </h5>
                  <p className="card-text"></p>
                  {(statusmessage && statusmessage.status === "00") ||
                    (statusmessage.status === "01" && (
                      <p className="text-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => history.push(`/print_receipt/${RRR}`)}
                        >
                          view receipt
                        </button>
                      </p>
                    ))}
                </React.Fragment>
              )}
              <div className="text-center">{loading && <Loading />}</div>
            </div>
          </div>
        </div>
      </div>
    </ConfirmTransactionStyles>
  );
};

export default ConfirmRemitaTransaction;
