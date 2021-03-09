import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import { useQuery } from "@apollo/client";
import { StudentTransaction } from "../graphql/queries";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";
import TransactionViewComponent from "./reuseableComponents/viewTransactionComponents";

const ViewTransactionStyles = styled.div``;

const ViewTransaction = (props) => {
  const [transaction, setTransaction] = useState([]);
  const [errors, setErrors] = useState([]);
  const [regNumber, setRegNumber] = useState("");

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
      setErrors(ExtractError(error));
    }

    if (data) {
      const trans = data.studentTransaction;
      setTransaction(trans);
    }
  }, [error, data]);

  return (
    <ViewTransactionStyles>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">{loading && <Loading />}</div>

          <ErrorDisplay errors={errors} />

          {transaction.length && (
            <TransactionViewComponent
              transactionDetails={transaction}
              history={props.history}
            />
          )}

          {transaction.length === "0" && <p>no transaction</p>}
        </div>
      </div>
    </ViewTransactionStyles>
  );
};

export default ViewTransaction;
