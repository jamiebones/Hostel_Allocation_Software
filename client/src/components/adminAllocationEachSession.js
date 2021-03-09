import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  ExtractError,
  IncrementSessionFiveYears,
  CapFirstLetterOfEachWord,
} from "../modules/utils";
import { GetAdminAllocation } from "../graphql/queries";

import ErrorDisplay from "./common/errorDisplay";
import styled from "styled-components";

const AdminAllocationStyles = styled.div`
  table tr > td:first-child {
    font-weight: bold;
    text-align: center;
  }

  table tr > td:nth-child(2) {
    text-align: center;
  }
`;

const AdminAllocationEachSession = () => {
  const [errors, setErrors] = useState([]);

  const [allocation, setAllocation] = useState([]);

  const [adminAllocationQueries, adminAllocationResult] = useLazyQuery(
    GetAdminAllocation
  );

  useEffect(() => {
    if (adminAllocationResult.error) {
      setErrors(ExtractError(adminAllocationResult.error));
    }

    if (adminAllocationResult.data) {
      setAllocation(adminAllocationResult.data.adminAllocationBySession);
    }
  }, [adminAllocationResult.data, adminAllocationResult.error]);

  const handleGetAllocationByAdmin = async (e) => {
    const value = e.target.value;
    if (value == "0") return;
    try {
      await adminAllocationQueries({
        variables: {
          session: e.target.value,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminAllocationStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ErrorDisplay errors={errors} />

          <div className="form-group">
            <label>Session</label>
            <select
              className="custom-select"
              onChange={handleGetAllocationByAdmin}
            >
              {IncrementSessionFiveYears().map(({ value, text }, i) => {
                return (
                  <option value={value} key={i}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          {allocation.length > 0 && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Info</th>
                  <th>Bed Info</th>
                  <th>Assigned By</th>
                </tr>
              </thead>

              <tbody>
                {allocation.map(
                  (
                    {
                      session,
                      date,
                      regNumber,
                      student: { dept, faculty, currentLevel },
                      name,
                      phoneNumber,
                      alloctedBy,
                      roomNumber,
                      hallName,
                      bedNumber,
                    },
                    index
                  ) => {
                    return (
                      <tr key={index}>
                        <td>
                          <p>{index + 1}</p>
                        </td>
                        <td>
                          <p>
                            <span>{CapFirstLetterOfEachWord(name)}</span>
                            <br />
                            <span>{regNumber.toUpperCase()}</span>
                            <br />
                            <span>{CapFirstLetterOfEachWord(dept)}</span>
                            <br />
                            <span>{CapFirstLetterOfEachWord(faculty)}</span>
                            <br />
                            <span>{phoneNumber}</span>
                            <br />
                            <span>{currentLevel}</span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span>{CapFirstLetterOfEachWord(hallName)}</span>
                            <br />
                            <span>{CapFirstLetterOfEachWord(roomNumber)}</span>
                            <br />
                            <span>{bedNumber}</span>
                            <br />
                          </p>
                        </td>
                        <td>
                          <p>
                            {alloctedBy} : {date} of {session} acedemic session
                          </p>
                        </td>
                       
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}

          {allocation.length === "0" && <p>no data</p>}
        </div>
      </div>
    </AdminAllocationStyles>
  );
};

export default AdminAllocationEachSession;
