import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AllocationToStudent } from "../graphql/queries";
import { ConfirmStudentHostelAllocation } from "../graphql/mutation";
import { ExtractError, IncrementSession } from "../modules/utils";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import styled from "styled-components";
import AllocationComponent from "./allocationComponent";

const ConfirmHostelStyles = styled.div`
  th {
    text-align: center;
  }
  .allocation-div {
    padding: 40px;
    padding-bottom: 50px;
    border: 1px solid green;
    margin-bottom: 10px;
    border-top: 10px solid rgb(54 74 65);
  }
`;

const ConfirmHostelAccomodation = () => {
  const [session, setSession] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [errors, setError] = useState([]);

  const [allocation, setStudentAllocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [studentQuery, studentQueryResult] = useLazyQuery(AllocationToStudent);

  const [confirmStudentMutation, confirmStudentResult] = useMutation(
    ConfirmStudentHostelAllocation
  );

  useEffect(() => {
    setStudentAllocation("");
    if (studentQueryResult.data) {
      setStudentAllocation(studentQueryResult.data.getAllocationToStudent);
    }

    if (studentQueryResult.error) {
      let error = ExtractError(studentQueryResult.error);
      setError(error);
    }
    setSubmitted(false);
  }, [studentQueryResult.data, studentQueryResult.error]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "session":
        if (value != "0") setSession(value);
        break;
      case "regNumber":
        setRegNumber(value);
    }
  };

  useEffect(() => {
    if (confirmStudentResult.error) {
      setError(ExtractError(confirmStudentResult.error));
      setSubmitted(!submitted);
    }
    if (confirmStudentResult.data) {
      //the confirmation was successful.
      setSubmitted(!submitted);
    }
  }, [confirmStudentResult.data, confirmStudentResult.error]);

  const handleConfirmStudent = async () => {
    try {
      setSubmitted(!submitted);
      await confirmStudentMutation({
        variables: {
          regNumber,
          session,
        },
        refetchQueries: [
          {
            query: AllocationToStudent,
            variables: {
              regNumber,
              session,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session) return window.alert("please select the session");
    if (!regNumber) return window.alert("please enter the student reg number");
    setSubmitted(!submitted);
    try {
      studentQuery({
        variables: {
          session,
          regNumber,
        },
      });
      setSubmitted(false);
    } catch (error) {
      setSubmitted(!submitted);
      console.log(error);
    }
  };

  return (
    <ConfirmHostelStyles>
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-5 col-sm-12">
          <dic className="text-center">
            <h3>Confirm Hostel Allocation</h3>
          </dic>

          <div className="text-center">{submitted && <Loading />}</div>
          <div className="allocation-div">
            <ErrorDisplay errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="session">Session</label>
                <select
                  name="session"
                  className="custom-select"
                  onChange={handleChange}
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

              <div className="form-group">
                <label htmlFor="regNumber">Reg Number:</label>
                <input
                  type="text"
                  onChange={handleChange}
                  className="form-control"
                  id="regNumber"
                  name="regNumber"
                  aria-describedby="regNumber"
                />
              </div>
              <button
                type="submit"
                className="btn btn-danger mb-4 float-right"
                disabled={submitted}
              >
                {submitted ? "searching........" : "check allocation"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-8 col-sm-12">
          {allocation && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Student Details</th>
                    <th scope="col">Accomodation Details</th>
                    <th scope="col">Photograph</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <AllocationComponent
                      allocation={allocation}
                      confirmFunc={handleConfirmStudent}
                      submitted={submitted}
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ConfirmHostelStyles>
  );
};

export default ConfirmHostelAccomodation;
