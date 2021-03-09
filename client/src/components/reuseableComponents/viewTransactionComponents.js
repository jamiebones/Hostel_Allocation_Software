import React from "react";
import styled from "styled-components";
import { CapFirstLetterOfEachWord } from "../../modules/utils";
const ViewTransactionComponentStyles = styled.div``;

const ViewTransactionComponent = ({ transactionDetails, history }) => {
  return (
    <ViewTransactionComponentStyles>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Student Info</th>
                <th scope="col">Transaction Details</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactionDetails.map(
                ({
                  amount,
                  transactionId,
                  payerName,
                  regNumber,
                  session,
                  date,
                  roomDetails: { roomNumber, hallName, bedSpace },
                  rrr,
                  successful,
                }) => {
                  return (
                    <tr key={transactionId}>
                      <td>
                        <p>{CapFirstLetterOfEachWord(payerName)}</p>
                        <p>{regNumber.toUpperCase()}</p>
                        <p>{session}</p>
                      </td>
                      <td>
                        <p>&#8358;{amount}</p>
                        <p>{date}</p>
                        <p>{CapFirstLetterOfEachWord(hallName)}</p>
                        <p>{roomNumber}</p>
                        <p>{bedSpace}</p>
                      </td>
                      <td>
                        {successful ? (
                          <div>
                            <button
                              onClick={() =>
                                history.push(`/print_receipt/${rrr}`)
                              }
                              className="btn btn-primary"
                            >
                              view receipt
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              onClick={() =>
                                history.push(
                                  `/confirm_transaction?RRR=${rrr}&orderID=${transactionId}`
                                )
                              }
                              className="btn btn-success"
                            >
                              confirm transaction
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ViewTransactionComponentStyles>
  );
};

export default ViewTransactionComponent;
