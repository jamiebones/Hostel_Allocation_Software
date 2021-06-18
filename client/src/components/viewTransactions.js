import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import { useQuery } from "@apollo/client";
import { StudentTransaction } from "../graphql/queries";
import TransactionViewComponent from "./reuseableComponents/viewTransactionComponents";

const ViewTransactionStyles = styled.div`
  .no-transaction {
    border: 1px solid green;
    padding: 40px;
    border-top: 10px solid rgb(54 74 65);
    margin-top: 20px;
  }
`;

const ViewTransaction = (props) => {
  const [transaction, setTransaction] = useState([]);
  const [errors, setErrors] = useState(null);
  const [regNumber, setRegNumber] = useState("");
  const [noData, setNoData] = useState(null);

  const { state } = props.location;

  useEffect(() => {
    if (!state && !state.regNumber) {
      return props.history.push("/dashboard");
    }
    setRegNumber(state.regNumber);
  }, []);

  const { loading, error, data } = useQuery(StudentTransaction, {
    variables: {
      regNumber: regNumber,
    },
  });

  useEffect(() => {
    if (error) {
      setErrors(error);
    }

    if (data) {
      const trans = data.studentTransaction;
      if (trans) {
        setTransaction(trans);
      } else {
        setNoData(true);
      }
    }
  }, [error, data]);

  return (
    <ViewTransactionStyles>
      <div className="row">
        <div className="col-md-12">
          <h3 className="text-info text-center">Payment Transactions</h3>
          <div className="text-center">
            {loading && <Loading />}
            {errors && <p className="lead text-danger">{errors.message}</p>}
          </div>

          <ErrorDisplay errors={errors} />

          {transaction.length > 0 && (
            <TransactionViewComponent
              transactionDetails={transaction}
              history={props.history}
            />
          )}

          <div className="text-center">
            {noData && (
              <div className="row justify-content-center">
                <div className="col-6">
                  <div className="no-transaction">
                    <p className="lead">
                      you currently have to transaction details to view.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewTransactionStyles>
  );
};

export default ViewTransaction;
