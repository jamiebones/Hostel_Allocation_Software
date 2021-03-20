import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import { GetTransactionUsingRRR } from "../graphql/queries";
import { ExtractError, FormatDate } from "../modules/utils";

import PaymentReceipts from "./reuseableComponents/payemntReceipts";

const ViewPaymentReceipt = (props) => {
  const [transaction, setTransaction] = useState();
  const [errors, setErrors] = useState([]);
  const { rrr } = props.match.params;
  const { loading, error, data } = useQuery(GetTransactionUsingRRR, {
    variables: {
      rrr: rrr,
    },
  });

  useEffect(() => {
    if (error) {
      setErrors(ExtractError(error));
    }

    if (data) {
      const trans = data.getTransactionWithRRR;
      setTransaction(trans);
    }
  }, [error, data]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="text-center">
          <ErrorDisplay errors={errors} />
        </div>
        <div className="text-center">{loading && <Loading />}</div>

        {transaction && (
          <div>
            <PaymentReceipts transactionDetails={transaction} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPaymentReceipt;
