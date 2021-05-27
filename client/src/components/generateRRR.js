import React from "react";
import RemitaTransactionComponent from "./common/makeTransactionComponent";

const GenerateRRRPayment = (props) => {
  const { state } = props.location;
  if (state && state.error ) {
    return <div className="text-center">
       <p className="lead text-danger">{state && state.error }</p>;
    </div>
    
  }
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="text-center font-weight-bold">Transaction Details</h2>
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
