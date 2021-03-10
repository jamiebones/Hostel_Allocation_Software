import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { CreateStudentAccount } from "../graphql/mutation";
import { ExtractError } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";

const CreateAccountStyles = styled.div`
  .form-control-file {
    width: 200px;
  }

  .noticeBoard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    height: 200px;
    background-color: #7ca8ea;
    color: #000;
  }
  .btn-submitstudent {
    margin-bottom: 20px;
  }
`;

const StudentAccountCreation = (props) => {
  const { state } = props.location;

  const [student, setStudent] = useState((state && state.student) || {});

  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [file, setFile] = useState("");
  useEffect(() => {
    console.log(student);
    if (state && !state.student) {
      props.history.push("/");
    }
  }, []);

  const [createNewAccount, createNewAccountResult] = useMutation(
    CreateStudentAccount
  );

  useEffect(() => {
    if (createNewAccountResult.error) {
      let errorArray = [];
      setSubmitted(!submitted);
      errorArray = ExtractError(createNewAccountResult.error);
      setErrors(errorArray);
      setLoading(!loading);
    }

    if (createNewAccountResult.data) {
      setLoading(!loading);
      alert(`Account was successfully created.Please login into your account.`);
      props.history.push("/login");
    }
  }, [createNewAccountResult.error, createNewAccountResult.data]);

  const onInputChange = (event) => {
    const eventName = event.target.name;
    const value = event.target.value;
    switch (eventName) {
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setconfirmPassword(value);
        break;
      default:
    }
  };

  if (!state || !state.student) return <Redirect to="/" />;

  if (loading) {
    return <p>consulting database please wait.....</p>;
  }

  const submitStudentDataToDatabase = async (e) => {
    try {
      e.preventDefault();
      //gather all the variables here
      if (password !== confirmPassword) {
        window.alert("password does not match");
        return;
      }

      const studentObject = { ...student };
      studentObject.password = password;
      setSubmitted(!submitted);
      student.password = password;
      setLoading(!loading);
      await createNewAccount({
        variables: {
          input: studentObject,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CreateAccountStyles>
      <ErrorDisplay errors={errors} />
      <form
        onSubmit={submitStudentDataToDatabase}
        // action="/upload_studentData"
        // method="POST"
        // encType="multipart/form-data"
      >
        <div className="row">
          <div className="col-md-4 offset-md-3 order-md-1">
            <div className="noticeBoard">
              <p>This sjjsh sjsjjs kkak kkaka wkwkwk skksks</p>
              <p>This sjjsh sjsjjs kkak kkaka wkwkwk skksks</p>
              <p>This sjjsh sjsjjs kkak kkaka wkwkwk skksks</p>
            </div>
          </div>

          <div className="col-md-2 order-md-12">
            <div className="float-md-right">
              <div className="preview-images">
                <img
                  src={`http://uniuyo.edu.ng/eportals/passports/${student && student.profileImage}`}
                  className="passport"
                  id="passportImage"
                  style={{ width: 200 + "px", height: 200 + "px" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                readOnly
                type="text"
                className="form-control"
                id="name"
                value={student.name && student.name.toUpperCase()}
                aria-describedby="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Reg Number</label>
              <input
                readOnly
                type="text"
                className="form-control"
                id="regNumber"
                aria-describedby="regNumber"
                value={student.regNumber && student.regNumber.toUpperCase()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Email</label>
              <input
                readOnly
                type="text"
                className="form-control"
                id="email"
                aria-describedby="email"
                value={student.email}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sex">Sex</label>
              <input
                type="text"
                className="form-control"
                id="sex"
                readOnly
                value={student.sex && student.sex.toUpperCase()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dept">Department</label>
              <input
                readOnly
                type="text"
                className="form-control"
                id="dept"
                value={student.dept && student.dept.toUpperCase()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="faculty">Faculty</label>
              <input
                type="text"
                className="form-control"
                id="faculty"
                readOnly
                value={student.faculty && student.faculty.toUpperCase()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Current Level</label>
              <input
                readOnly
                type="text"
                className="form-control"
                value={student.currentLevel && student.currentLevel.toUpperCase()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Current Session</label>
              <input
                readOnly
                type="text"
                className="form-control"
                value={student.currentSession}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Entry Mode</label>
              <input
                readOnly
                type="text"
                className="form-control"
                value={student.entryMode && student.entryMode.toUpperCase()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                onChange={onInputChange}
                name="password"
                value={password}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">confirm password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                onChange={onInputChange}
                name="confirmPassword"
                value={confirmPassword}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submitstudent"
              disabled={submitted}
            >
              {submitted ? "please wait submitting......" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </CreateAccountStyles>
  );
};

export default StudentAccountCreation;