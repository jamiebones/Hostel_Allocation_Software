import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
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
import { RiReservedFill } from "react-icons/ri";
import { IoIosBed } from "react-icons/io";
import { TiPrinter } from "react-icons/ti";
import { AiOutlineTransaction } from "react-icons/ai";
import { GiStopSign } from "react-icons/gi";

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
    cursor: pointer;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list-group {
    cursor: pointer;
  }
  .iconClass {
    color: rgb(54 74 65);
  }
  .error-message {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #dedbdb;
    color: red;
    font-size: 24px;
    padding: 20px;
    width:max-content;
    
  }
  .welcome {
    text-align-last: center;
  }
  .iconClassRed {
    color: red;
    align-self: center;
    margin-right: 30px;
  }
`;

const DashBoard = (props) => {
  const { regNumber } = props.currentUser;
  const [student, setStudent] = useState("");
  const [bedSpace, setBedSpace] = useState("");
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

  const history = useHistory();

  useEffect(() => {
    if (
      props?.location?.state?.confirmStatus
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
      setErrors(null);
    }

    if (studentData.error) {
      setErrors(studentData.error);
    }
  }, [studentDataResult.data, studentDataResult.error]);

  useEffect(() => {
    if (result.data) {
      setBedSpace(result.data.allocateBedSpace);
      setErrors(null);
    }
    if (result.error) {
      setErrors(result.error);
      setBedSpace("");
    }
  }, [result.data, result.error]);

  useEffect(() => {
    if (resultReserved.data) {
      setErrors(null);
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
              <div className="col-md-3">
                <div className="info-panel">
                  <p className="lead text-left">
                    Hello , {regNumber && regNumber.toUpperCase()}
                  </p>

                  <p className="welcome">
                    You can bid for a hostel space by clicking the Bid for
                    hostel space button. If successful payment will be via the
                    Remita platform. Please confirm your transaction before
                    making a subsequent failed payment transaction.
                  </p>
                </div>

                <div>
                  <ul className="list-group">
                    <li
                      className="list-group-item"
                      onClick={handleHostelSpaceBid}
                    >
                      <IoIosBed size="6.5rem" className="iconClass" />
                      Bid for hostel space
                    </li>
                    <li
                      className="list-group-item"
                      onClick={fetchReserveBedSpace}
                    >
                      <RiReservedFill size="6.5rem" className="iconClass" />
                      View reserve bed space
                    </li>
                    <li
                      className="list-group-item"
                      onClick={() =>
                        history.push("/student_transactions", {
                          regNumber: regNumber,
                        })
                      }
                    >
                      <AiOutlineTransaction
                        size="6.5rem"
                        className="iconClass"
                      />
                      Confirm Transactions
                    </li>

                    <li
                      className="list-group-item"
                      onClick={() => history.push("/print_allocation_session")}
                    >
                      <TiPrinter size="6.5rem" className="iconClass" />
                      Print hostel allocation
                      {/* <Link
                        to="/print_allocation_session"
                        className="btn btn-primary"
                      >
                        Print hostel allocation
                      </Link> */}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-1 col-sm-1 col-md-1"></div>

              <div className="col-lg-6 col-sm-6 col-md-6 offset-md-1">
                {result.loading && (
                  <p className="lead">finding bed space.......</p>
                )}

                {resultReserved.loading && (
                  <p className="lead">checking bed space.......</p>
                )}

                {errors && (
                  <div className="error-message">
                    <p>
                      <GiStopSign size="2.5rem" className="iconClassRed" />
                    </p>

                    <p className="lead text-danger">{errors.message}</p>
                  </div>
                )}

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
