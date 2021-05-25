import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { ContactUniuyoPortal } from "../graphql/queries";
import styled from "styled-components";
import { ExtractError } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";

const HomeStyles = styled.div`
  .regDiv {
    margin-top: 10vh;
  }
  .bigInput {
    padding: 20px;
    font-size: 24px;
  }
  .regButton {
    margin-top: 20px;
    justify-content: center;
  }
  .butDiv {
    display: flex;
    justify-content: center;
  }
  .noticeBoard {
    background-color: #1f5f58;
    color: #fff;
    font-size: 20px;
    padding: 10px;
    min-height: 40vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .form-control-lg {
    padding: 1.5rem 1rem;
    font-size: 30px;
  }
  .instruction {
    font-size: 1.22rem;
    padding: 50px;
    text-align-last: center;
    :first-letter {
      font-size: 40px;
    }
  }
`;

const Home = ({ history, authenticated }) => {
  const [regNumber, setRegNumber] = useState("");
  const [student, setStudentData] = useState("");
  const [errors, setErrors] = useState([]);
  const [getStudentData, result] = useLazyQuery(ContactUniuyoPortal);

  useEffect(() => {
    if (result.data) {
      setStudentData(result.data.contactUniuyoPortal);
      history.push(`/create_account`, {
        student: result.data.contactUniuyoPortal,
      });
    }
    if (result.error) {
      setErrors(ExtractError(result.error));
    }
  }, [result.data, result.error]);

  const submitHandler = (e) => {
    //submit function
    setErrors([]);
    e.preventDefault();
    try {
      if (regNumber) {
        getStudentData({
          variables: {
            regNumber: regNumber,
          },
        });
      }
    } catch (error) {}
  };

  const handleInputChange = (event) => {
    const regNumber = event.target.value;
    setRegNumber(regNumber);
  };

  return (
    <HomeStyles>
      <div className="row">
        <div className="col-sm-6 col-md-5 order-sm-12 offset-md-1 col-xs-12">
          <div className="noticeBoard">
            <p className="lead">
              <b>Student Affairs Division</b>
            </p>
            <p className="instruction">
              This is a portal operated by the Student Affairs Division of
              University of Uyo. This portal is used for hostel accomodation
              bids. Students can bid for accomodation via this portal. If
              successful, the bed space is placed on hold for a period for a
              period of 24 hours after which if payment for the space is not
              effected, the space is recycled and offered to another student.
              Payment for hostel space is via the Remita platform and hostel bid
              are treated on a first come basics...
            </p>
          </div>
        </div>

        <div className=" col-sm-6 order-sm-1 col-md-4 offset-md-2 col-xs-12">
          <div className="regDiv">
            <ErrorDisplay errors={errors} />

            {result.loading && <Loading />}
            {authenticated ? (
              "hello i am auth level"
            ) : (
              <React.Fragment>
                <p className="lead">
                  Student need to create an account by entering their reg number
                  into the text box below. If you already have an account,
                  please proceed to login.
                </p>
                <form onSubmit={submitHandler}>
                  <input
                    onChange={handleInputChange}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="enter registeration number"
                  />
                  <div className="butDiv">
                    <button
                      className="btn btn-primary btn-lg regButton"
                      type="submit"
                    >
                      submit
                    </button>
                  </div>
                </form>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </HomeStyles>
  );
};

export default Home;
