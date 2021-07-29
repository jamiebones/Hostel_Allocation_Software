import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  IncrementSession,
  CapFirstLetterOfEachWord,
  FormatDate,
} from "../modules/utils";
import { useLazyQuery } from "@apollo/client";
import { GetSuccessFullTransactions } from "../graphql/queries";
import Loading from "./common/loading";
import ExportToExcel from "./common/exportToExcel";

const TransactionViewStyles = styled.div`
  .bgvi {
    background-color: rgb(97, 50, 205);
    color: aliceblue;
  }

  .even {
    background-color: yellowgreen;
  }
  .button-div {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const AdminViewTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [errors, setErrors] = useState(null);
  const [noData, setNoData] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [transQuery, transResult] = useLazyQuery(GetSuccessFullTransactions, {
    variables: {
      session: selectedSession,
    },
  });

  useEffect(() => {
    if (transResult.error) {
      setErrors(transResult.error);
    }

    if (transResult.data) {
      const transData = transResult.data.getSuccessfulTransactionsBySession;
      if (transData.length > 0) {
        setTransactions(transData);
        setNoData(null);
      } else {
        setTransactions([]);
        setNoData(true);
      }
    }
  }, [transResult.error, transResult.data]);

  const handleSessionChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;
    setSelectedSession(value);
    transQuery();
  };

  const handleCheckChanged = (e, index) => {
    if (e.target.checked) {
      setSelectedColumn((prev) => [...prev, index]);
    } else {
      //remove from the index
      const filterIndex = selectedColumn.filter((e) => e !== index);
      setSelectedColumn(filterIndex);
    }
  };

  const handleColumnExport = (array, columnIndex) => {
    let selectedColumnsToExport = [];
    setSubmitted(true);
    array.map(
      ({
        amount,
        payerName,
        regNumber,
        date,
        roomDetails: { roomNumber, hallName, bedSpace, location, roomType },
        rrr,
      }) => {
        let selAmount = columnIndex.indexOf(3);
        let selName = columnIndex.indexOf(0);
        let selRegNumber = columnIndex.indexOf(1);
        let selDate = columnIndex.indexOf(4);
        let selHallName = columnIndex.indexOf(5);
        let selRoom = columnIndex.indexOf(6);
        let selBed = columnIndex.indexOf(7);
        let selLocation = columnIndex.indexOf(8);
        let selType = columnIndex.indexOf(9);
        let selRRR = columnIndex.indexOf(2);
        const obj = {};

        if (selName !== -1) {
          obj["Student Name"] = CapFirstLetterOfEachWord(payerName);
        }
        if (selRegNumber !== -1) {
          obj["Reg Number"] = regNumber.toUpperCase();
        }
        if (selAmount !== -1) {
          obj["Amount"] = amount;
        }
        if (selDate !== -1) {
          obj["Transaction Date"] = FormatDate(date);
        }
        if (selRRR !== -1) {
          obj["RRR"] = rrr;
        }
        if (selHallName !== -1) {
          obj["Hostel"] = CapFirstLetterOfEachWord(hallName);
        }
        if (selRoom !== -1) {
          obj["Room Number"] = roomNumber;
        }
        if (selBed !== -1) {
          obj["Bed Number"] = bedSpace;
        }
        if (selLocation !== -1) {
          obj["Campus"] = CapFirstLetterOfEachWord(location);
        }
        if (selType !== -1) {
          obj["Hostel Type"] = CapFirstLetterOfEachWord(roomType);
        }
        selectedColumnsToExport.push(obj);
      }
    );
    setSubmitted(false);
    return selectedColumnsToExport;
  };

  return (
    <TransactionViewStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3>View transactions by session</h3>
          <select className="form-control" onChange={handleSessionChange}>
            {IncrementSession().map(({ value, text }, i) => {
              return (
                <option key={i} value={value}>
                  {text}
                </option>
              );
            })}
          </select>
          <div className="text-center">
            {transResult.loading && <Loading />}
            {errors && <p className="lead text-danger">{errors.message}</p>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            {noData && (
              <p className="lead">
                No transaction details yet for {selectedSession}
              </p>
            )}
          </div>
          {transactions.length > 0 && (
            <React.Fragment>
              <div className="text-right button-div">
                <button
                  className="btn btn-warning"
                  disabled={submitted}
                  onClick={() =>
                    ExportToExcel(
                      handleColumnExport(transactions, selectedColumn),
                      `${selectedSession}_session_payment_list`
                    )
                  }
                >
                  Export To Excel
                </button>
              </div>
              <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="bgvi">
                  <tr>
                    <th scope="col" className="text-center">
                      Name{" "}
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 0)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Reg Number{" "}
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 1)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Amount{" "}
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 3)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Date{" "}
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 4)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      RRR
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 2)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Hostel{" "}
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 5)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Room{" "}
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 6)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Bed Space{" "}
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 7)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Campus
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 8)}
                      />
                    </th>
                    <th scope="col" className="text-center">
                      Type
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckChanged(e, 9)}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(
                    ({
                      amount,
                      payerName,
                      regNumber,
                      date,
                      roomDetails: {
                        roomNumber,
                        hallName,
                        bedSpace,
                        location,
                        roomType,
                      },
                      rrr,
                    }) => {
                      return (
                        <tr key={rrr} className="even">
                          <td>
                            <p>{CapFirstLetterOfEachWord(payerName)}</p>
                          </td>
                          <td>
                            <p>{regNumber.toUpperCase()}</p>
                          </td>
                          <td>
                            <p>
                              <span>&#8358;{amount}</span>
                            </p>
                          </td>

                          <td>
                            <p>
                              <span>{date && FormatDate(date)}</span>
                            </p>
                          </td>

                          <td>
                            <p>
                              <span>{rrr}</span>
                            </p>
                          </td>
                          <td>
                            <p>
                              <span>{CapFirstLetterOfEachWord(hallName)}</span>
                            </p>
                          </td>
                          <td>
                            <p>
                              <span>{roomNumber}</span>
                            </p>
                          </td>

                          <td>
                            <p>
                              <span>{bedSpace}</span>
                            </p>
                          </td>
                          <td>
                            <p>{CapFirstLetterOfEachWord(location)}</p>
                          </td>
                          <td>
                            <p>{CapFirstLetterOfEachWord(roomType)}</p>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </TransactionViewStyles>
  );
};

export default AdminViewTransaction;
