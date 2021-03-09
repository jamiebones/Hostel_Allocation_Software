import React, { useEffect, useState } from "react";
import PrintAllocationComponent from "./printAllocationComponent";
import { AllocationToStudent } from "../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { ExtractError, IncrementSession } from "../modules/utils";

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
  const [data, setData] = useState("");
  const [errors, setErrors] = useState([]);
  const [hasRunQuery, sethasRunQuery] = useState(false);

  const [allocationQuery, allocationResult] = useLazyQuery(AllocationToStudent);

  useEffect(() => {
    if (allocationResult.data) {
      //push to where to print it
      setData(allocationResult.data.getAllocationToStudent);
      sethasRunQuery(true);
    }
    if (allocationResult.error) {
      let errorArray = ExtractError(allocationResult.error);
      setErrors(errorArray);
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
          {errors.map(({ message }, i) => {
            return (
              <p key={i} className="lead text-danger">
                {message}
              </p>
            );
          })}
          {allocationResult.loading && <Loading />}
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
          {data && hasRunQuery && (
            <div>
              <PrintAllocationComponent allocationData={data} />
            </div>
          )}

          {!data && hasRunQuery && (
            <div>
              <p>You do not have any hostel allocation</p>
            </div>
          )}
        </div>
      </div>
    </PrintAllocationStyles>
  );
};

export default PrintAllocationBySession;
