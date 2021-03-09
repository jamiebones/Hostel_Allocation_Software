import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { AllocateBedSpace } from "../graphql/mutation";
import {
  GetReservedBedSpace,
  CheckPhoneNumberConfirmation,
  GetStudentData,
} from "../graphql/queries";
import { ExtractError } from "../modules/utils";
import Loading from "./common/loading";
import ConfirmPhoneNumber from "./confirmPhoneNumber";
import ErrorDisplay from "./common/errorDisplay";
import BedSpaceAllocationTableComponent from "./reuseableComponents/bedSpaceAllocationTableComponent";

const date = require("date-and-time");

const DashBoardStyle = styled.div`
  .resultBoard {
    display: flex;
    flex-direction: column;
  }
  table tr > td:nth-child(2) {
    text-align: right;
  }
  .list-group-item {
    padding: 1.75rem 1.25rem;
  }
  .list-group {
  }
`;

const DashBoard = (props) => {
  const { regNumber } = props.currentUser;
  const [student, setStudent] = useState("");
  const [bedSpace, setBedSpace] = useState("");
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState([]);
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);

  const [getBedSpace, result] = useMutation(AllocateBedSpace);

  const { loading, error, data } = useQuery(CheckPhoneNumberConfirmation, {
    variables: {
      regNumber: regNumber,
    },
  });
  const [getReserved, resultReserved] = useLazyQuery(GetReservedBedSpace);

  const [studentData, studentDataResult] = useLazyQuery(GetStudentData);

  // const getTimeRemaining = (lockTime) => {
  //   let today = new Date();
  //   let time = new Date(lockTime);
  //   const minutes = date.subtract(today, time).toMinutes();
  //   const seconds = date.subtract(today, time).toSeconds();
  //   //setTimer(`${minutes}:${seconds}`);
  //   return `${Math.ceil(minutes)}:${Math.ceil(seconds)}`;
  // };

  //this is called when the phone has been confirmed
  useEffect(() => {
    if (
      props &&
      props.location &&
      props.location.state &&
      props.location.state.confirmStatus
    ) {
      setPhoneConfirmed(true);
    }
  }, []);

  useEffect(() => {
    if (error) {
      setErrors(ExtractError(error));
    }
    if (data) {
      setPhoneConfirmed(data.confirmIfPhone);
    }
  }, [error, data]);

  useEffect(() => {
    if (studentDataResult.data) {
      //this is where we make our flutter wave payment request
      setStudent(studentDataResult.data.studentData);
    }

    if (studentData.error) {
      setErrors(ExtractError(result.error));
    }
  }, [studentDataResult.data, studentDataResult.error]);

  useEffect(() => {
    if (result.data) {
      setBedSpace(result.data.allocateBedSpace);
    }
  }, [result.data]);

  useEffect(() => {
    if (resultReserved.data) {
      setBedSpace(resultReserved.data.getbedSpaceReserved);
    }
  }, [resultReserved.data]);

  const fetchReserveBedSpace = (e) => {
    setErrors([]);
    e.preventDefault();
    try {
      e.preventDefault();
      getReserved({
        variables: {
          regNumber: regNumber,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (resultReserved.error) {
      setErrors(ExtractError(resultReserved.error));
    }
  }, [resultReserved.error]);

  useEffect(() => {
    if (result.error) {
      setErrors(ExtractError(result.error));
    }
    if (error) {
      setErrors(ExtractError(error));
    }
  }, [result.error]);

  const handleHostelSpaceBid = async (e) => {
    //submit function
    setErrors([]);
    try {
      e.preventDefault();
      await getBedSpace({
        variables: {
          regNumber: regNumber,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashBoardStyle>
      {loading && (
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">
              <Loading />
            </div>
          </div>
        </div>
      )}
      <div>
        {phoneConfirmed ? (
          <React.Fragment>
            <div className="row">
              <div className="col-md-5">
                <p className="text-center lead">
                  Hello {regNumber && regNumber.toUpperCase()}
                </p>

                <div>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <button
                        className="btn btn-primary"
                        onClick={handleHostelSpaceBid}
                      >
                        Bid for hostel space
                      </button>
                    </li>
                    <li className="list-group-item">
                      <button
                        className="btn btn-primary"
                        onClick={fetchReserveBedSpace}
                      >
                        View reserve bed space
                      </button>
                    </li>
                    <li className="list-group-item">
                      <Link
                        className="btn btn-primary"
                        to={{
                          pathname: "/student_transactions",

                          state: {
                            regNumber: regNumber,
                          },
                        }}
                      >
                        {" "}
                        Confirm Transactions
                      </Link>
                    </li>

                    <li className="list-group-item">
                      <Link
                        to="/print_allocation_session"
                        className="btn btn-primary"
                      >
                        Print hostel allocation
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-5 offset-md-1">
                {result.loading && <p>finding bed space.......</p>}

                {resultReserved.loading && <p>checking bed space.......</p>}

                <ErrorDisplay errors={errors} />
                <BedSpaceAllocationTableComponent
                  {...props}
                  bedSpace={bedSpace}
                  regNumber={regNumber}
                />
              </div>
            </div>
          </React.Fragment>
        ) : (
          /**this component is rendered when the person has not yet confirmed their phone number */
          <ConfirmPhoneNumber {...props} />
        )}
      </div>
    </DashBoardStyle>
  );
};

export default DashBoard;
