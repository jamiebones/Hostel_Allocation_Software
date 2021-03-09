import React from "react";
import RemitaTransactionComponent from "./common/makeTransactionComponent";

const GenerateRRRPayment = (props) => {
  const { state } = props.location;
  if (state && state.error && state.error.length) {
    return <p>{state && state.error && state.error[0]}</p>;
  }
  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <p className="text-center lead font-weight-bold">Transaction Details</p>
        {state && (
          <RemitaTransactionComponent
            {...props}
            history={props.history}
            transaction={state && state.transaction}
          />
        )}
      </div>
    </div>
  );
};

export default GenerateRRRPayment;
