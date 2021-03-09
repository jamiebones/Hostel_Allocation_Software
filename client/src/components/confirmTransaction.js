// import React, { useState, useEffect } from "react";

// import styled from "styled-components";
// import { useMutation, useLazyQuery, useQuery } from "@apollo/react-hooks";

// import { StudentTransaction, AllocationToStudent } from "../graphql/queries";
// import { ConfirmRemitaRRRTransaction } from "../graphql/mutation";

// const ConfirmTransactionStyles = styled.div``;

// const ConfirmTransaction = (props) => {
//   const {
//     currentUser: { regNumber },
//   } = props;
//   const { loading, error, data } = useQuery(StudentTransaction, {
//     variables: { payerId: regNumber },
//   });

//   const [confirmRRR, confirmResult] = useMutation(ConfirmRemitaRRRTransaction);

//   const [allocation, allocationResult] = useLazyQuery(AllocationToStudent);

//   useEffect(() => {
//     if (confirmResult.data) {
//       //
//       window.alert(
//         "transaction confirmation successful. please print out your accomodation slip"
//       );
//     }
//   }, [confirmResult.data]);

//   useEffect(() => {
//     if (allocationResult.data) {
//       //push to where to print it 
//       props.history.push('/print_allocation_receipt', {
//           data: allocationResult.data.getAllocationToStudent
//       })
//     }
//   }, [allocationResult.data]);

//   const confirmRemitaTransaction = async (rrr) => {
//     await confirmRRR({
//       variables: { rrr: rrr },
//     });
//   };

//   const getAllocationDetails = (session, regNumber) => {
//     allocation({
//       variables: {
//         session,
//         regNumber,
//       },
//     });
//   };

//   return (
//     <ConfirmTransactionStyles>
//       <div className="row">
//         <div className="col-md-8 offset-2">
//           {loading && (
//             <div>
//               <p>Loading......</p>
//             </div>
//           )}

//           {confirmResult.loading && (
//             <div>
//               <p>confirming rrr......</p>
//             </div>
//           )}

//           {confirmResult.error && (
//             <div>
//               <p>{error}</p>
//             </div>
//           )}

//           {allocationResult.loading && (
//             <div>
//               <p>please wait......</p>
//             </div>
//           )}

//           {allocationResult.error && (
//             <div>
//               <p>{error}</p>
//             </div>
//           )}

//           {data && <p className="text-center">Available Transactions</p>}

//           {error && <div>{error}</div>}
//           {data && (
//             <table className="table table-dark">
//               <thead>
//                 <tr>
//                   <th scope="col">RRR</th>
//                   <th scope="col">Amount</th>
//                   <th scope="col">Session</th>
//                   <th scope="col">Date</th>
//                   <th scope="col">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.getStudentTransactions.map(
//                   ({ id, amount, session, date, RRR, successful, payerId }) => {
//                     return (
//                       <tr key={id}>
//                         <td>{RRR}</td>
//                         <td>{amount}</td>
//                         <td>{session}</td>
//                         <td>{date}</td>
//                         <td>
//                           {!successful && RRR && (
//                             <button
//                               className="btn btn-default"
//                               onClick={() => confirmRemitaTransaction(RRR)}
//                             >
//                               confirm transaction
//                             </button>
//                           )}

//                           {successful && RRR && (
//                             <button
//                               className="btn btn-info"
//                               onClick={() =>
//                                 getAllocationDetails(session, payerId)
//                               }
//                             >
//                               print hostel slip
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   }
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </ConfirmTransactionStyles>
//   );
// };

// export default ConfirmTransaction;
