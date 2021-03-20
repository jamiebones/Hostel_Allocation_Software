import React from "react";
import styled from "styled-components";
import { CapFirstLetterOfEachWord, FormatDate } from "../../modules/utils";
const ViewTransactionComponentStyles = styled.div`
  span {
    padding-right: 20px;
    font-weight: bold;
    float: right;
  }
  button{
    vertical-height: center;
  }
`;

const ViewTransactionComponent = ({ transactionDetails, history }) => {
  return (
    <ViewTransactionComponentStyles>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col" className="text-center">Student Info</th>
                <th scope="col" className="text-center">Transaction Details</th>
                <th scope="col" className="text-center">Action</th>
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
                        <p>
                          Amount:
                          <span>&#8358;{amount}</span>
                        </p>
                        <p>
                          Date:
                          <span>{date && FormatDate(date)}</span>
                        </p>
                        <p>
                          Hostel/Hall
                          <span>{CapFirstLetterOfEachWord(hallName)}</span>
                        </p>
                        <p>
                          Room Number
                          <span>{roomNumber}</span>
                        </p>
                        <p>
                          Bed Space
                          <span>{bedSpace}</span>
                        </p>
                      </td>
                      <td>
                        {successful ? (
                          <div className="text-center">
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
                          <div className="text-center">
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
