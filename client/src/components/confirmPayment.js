// import React, { useEffect, useState } from "react";
// import { useMutation } from "@apollo/react-hooks";
// import Loading from "./common/loading";
// import ErrorDisplay from "./common/errorDisplay";
// import { ConfirmStudentTransaction } from "../graphql/mutation";
// import { ExtractError } from "../modules/utils";

// import PaymentReceipts from "./reuseableComponents/payemntReceipts";

// const queryString = require("query-string");

// const ConfirmPayment = (props) => {
//   const [transDetails, setTransDetails] = useState(null);
//   const parsed = queryString.parse(props.location.search);
//   const { status, tx_ref, transaction_id } = parsed;
//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [
//     confirmTransactionPayment,
//     confirmTransactionPaymentResult,
//   ] = useMutation(ConfirmStudentTransaction);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(!loading);
//         await confirmTransactionPayment({
//           variables: {
//             flutterId: transaction_id,
//             transId: tx_ref,
//           },
//         });
//       } catch (error) {
//         console.log("this is the error", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (confirmTransactionPaymentResult.error) {
//       setErrors(ExtractError(confirmTransactionPaymentResult.error));
//       setLoading(!loading);
//     }

//     if (confirmTransactionPaymentResult.data) {
//       setTransDetails(confirmTransactionPaymentResult.data.confirmTransaction);
//       setLoading(!loading);
//     }
//   }, [
//     confirmTransactionPaymentResult.error,
//     confirmTransactionPaymentResult.data,
//   ]);

//   if (status !== "successful") {
//     return (
//       <div>
//         <h1>Transaction failed. Try again</h1>
//       </div>
//     );
//   }
//   return (
//     <div className="row">
//       <div className="col-md-12">
//         <div className="text-center">
//           <ErrorDisplay errors={errors} />
//         </div>
//         <div className="text-center">{loading && <Loading />}</div>

//         {transDetails && (
//           <div>
//             <PaymentReceipts transactionDetails={transDetails} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConfirmPayment;
