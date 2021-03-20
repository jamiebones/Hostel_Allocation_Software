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
import Loading from "./common/loading";
import ConfirmPhoneNumber from "./confirmPhoneNumber";
import BedSpaceAllocationTableComponent from "./reuseableComponents/bedSpaceAllocationTableComponent";

const DashBoardStyle = styled.div`
  .info-panel {
    border: 1px solid #c0c0c0;
    padding: 10px;
    margin-bottom: 20px;
  }
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
  const [errors, setErrors] = useState(null);
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);

  const [getBedSpace, result] = useMutation(AllocateBedSpace);

  const { loading, error, data } = useQuery(CheckPhoneNumberConfirmation, {
    variables: {
      regNumber: regNumber,
    },
  });
  const [getReserved, resultReserved] = useLazyQuery(GetReservedBedSpace);

  const [studentData, studentDataResult] = useLazyQuery(GetStudentData);

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
      setErrors(error);
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
      setErrors(studentData.error);
    }
  }, [studentDataResult.data, studentDataResult.error]);

  useEffect(() => {
    if (result.data) {
      setBedSpace(result.data.allocateBedSpace);
    }
    if (result.error) {
      setErrors(result.error);
    }
  }, [result.data, result.error]);

  useEffect(() => {
    if (resultReserved.data) {
      setBedSpace(resultReserved.data.getbedSpaceReserved);
    }
    if (resultReserved.error) {
      setErrors(resultReserved.error);
    }
  }, [resultReserved.data, resultReserved.error]);

  const fetchReserveBedSpace = (e) => {
    setErrors(null);
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

  const handleHostelSpaceBid = async (e) => {
    //submit function
    setErrors(null);
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
                <div className="info-panel">
                  <p className="lead text-left">
                    Hello , {regNumber && regNumber.toUpperCase()}
                    
                  </p>

                  <p>
                    You can bid for a hostel space by clicking the Bid for hostel space button.
                    If successful payment will be via the Remita platform. Please confirm your transaction 
                    before making a subsequent failed payment transaction.

                  </p>
                </div>

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
                {result.loading && (
                  <p className="lead">finding bed space.......</p>
                )}

                {resultReserved.loading && (
                  <p className="lead">checking bed space.......</p>
                )}

                {errors && <p className="lead text-danger text-center">{errors.message}</p>}

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
