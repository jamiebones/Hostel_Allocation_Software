import React, { useEffect, useState } from "react";
import PrintAllocationComponent from "./printAllocationComponent";
import { AllocationToStudent } from "../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { IncrementSession } from "../modules/utils";

import Loading from "./common/loading";

import styled from "styled-components";

const PrintAllocationStyles = styled.div`
  @media print {
    .form-group {
      display: none;
    }
  }
`;

const PrintAllocationBySession = (props) => {
  const { regNumber } = props.currentUser;
  const [selectedSession, setSelectedSession] = useState("");
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [noData, setNoData] = useState("");

  const [allocationQuery, allocationResult] = useLazyQuery(AllocationToStudent);

  useEffect(() => {
    if (allocationResult.data) {
      //push to where to print it
      const result = allocationResult.data.getAllocationToStudent;
      if (result) {
        setData(result);
      } else {
        setNoData("No data found");
      }
    }
    if (allocationResult.error) {
      setErrors(allocationResult.error);
    }
  }, [allocationResult.data, allocationResult.error]);

  const handleSessionChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    setSelectedSession(value);
    allocationQuery({
      variables: {
        session: value,
        regNumber,
      },
    });
  };

  return (
    <PrintAllocationStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="text-center">
            <h3 className="text-center text-info d-print-none">
              Print Hostel Allocation Document
            </h3>
            {errors && <p className="lead text-danger">{errors.message}</p>}
            {allocationResult.loading && <Loading />}
          </div>

          <div className="form-group">
            <select
              className="custom-select selectSession"
              onChange={handleSessionChange}
            >
              {IncrementSession().map(({ value, text }, i) => {
                return (
                  <option key={i} value={value}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="col-md-12">
          {data && (
            <div>
              <PrintAllocationComponent allocationData={data} />
            </div>
          )}
        </div>

        <div className="col-md-6 offset-md-3">
          {noData == "No data found" && (
            <div className="card">
              <p className="lead text-center">
                You do not have any hostel allocation
              </p>
            </div>
          )}
        </div>
      </div>
    </PrintAllocationStyles>
  );
};

export default PrintAllocationBySession;
