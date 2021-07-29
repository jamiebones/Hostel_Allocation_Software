import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery } from "@apollo/client";
import { LoginUser } from "../graphql/queries";
import state from "../applicationState";
import { useRecoilState } from "recoil";
import { useHistory } from "react-router-dom";

import store from "store";

const LoginStyle = styled.div`
   .login-container {
    height: 600px;
    padding: 40px;
    border-radius: 20px;
    box-sizing: border-box;
    background-color: #f0ffff;
    background-color: ;
    margin-top: 40px;
    box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
  }
  .brand-logo {
    height: 100px;
    width: 100px;
    margin: auto;
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: 7px 7px 10px #cbced1, -7px -7px 10px white;
  }
  .input {
    background: #f0ffff;
    padding: 10px;
    padding-left: 20px;
    height: 50px;
    font-size: 14px;
    border-radius: 50px;
    box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
  }

  .login-button {
    border: none;
    margin-top: 20px;
    background: #1da1f2;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 900;
    transition: 0.5s;
    box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
    width: 100%;
  }

  .login-button:hover {
    box-shadow: none;
  }
`;

const Login = (props) => {
  const [isAuth, setAuthState] = useRecoilState(state.authState);
  const [currentUser, setCurrentUser] = useRecoilState(state.currentUserState);
  const [token, setToken] = useRecoilState(state.authToken);

  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setErrors] = useState(null);
  let history = useHistory();
  const [executeLogin, loginUserResult] = useLazyQuery(LoginUser);

  useEffect(() => {
    if (
      submitted &&
      loginUserResult.data &&
      loginUserResult.data.loginUser &&
      loginUserResult.called
    ) {
      const typename = loginUserResult.data.loginUser.__typename;

      if (typename === "Error") {
        const message = loginUserResult.data.loginUser.message;
        setErrors(message);
        setSubmitted(false);
      } else {
        //we are good here we have the baggages here
        const {
          id,
          email,
          userType,
          regNumber,
          token,
          name,
          accessLevel,
          active,
        } = loginUserResult.data.loginUser;

        store.set("authToken", token);
        store.set("userIdKey", id);
        store.set("isAuth", true);
        store.set("currentUser", {
          id,
          userType,
          name,
          email,
          regNumber,
          accessLevel,
          active,
        });
        setAuthState(true);
        setCurrentUser({
          id,
          userType,
          name,
          email,
          regNumber,
          accessLevel,
          active,
        });
        setToken(token);
        setSubmitted(false);
        if (accessLevel === "super-admin") {
          history.push("/admin/dashboard");
        } else if (accessLevel === "normal") {
          history.push("/dashboard");
        }
      }
    }
    if (loginUserResult.error) {
      setSubmitted(false);
      setErrors(loginUserResult.error.message);
    }
  }, [loginUserResult.data, loginUserResult.error]);

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
    executeLogin({
      variables: {
        regNumber,
        password,
        email,
      },
    });
  };

  const onInputChange = (event) => {
    const name = event.target.name;
    switch (name) {
      case "password":
        setPassword(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      case "regNumber":
        setRegNumber(event.target.value);
        break;
      default:
        break;
    }
  };
  return (
    <LoginStyle>
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-6 col-lg-3">
        <div className="login-container">

     
          <h3 className="text-info text-center">Login Page</h3>
          <p className="text-danger lead text-center">{error}</p>
          <p className="lead text-center">
            Students are required to login with their reg number and chosen
            password
          </p>

          <form onSubmit={submitForm}>
            <div className="form-group">
              <label htmlFor="name">Reg Number</label>
              <input
                type="text"
                className="form-control input"
                name="regNumber"
                aria-describedby="regNumber"
                value={regNumber}
                onChange={onInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Email</label>
              <input
                type="email"
                className="form-control input"
                name="email"
                aria-describedby="email"
                value={email}
                onChange={onInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">password</label>
              <input
                type="password"
                className="form-control input"
                id="password"
                onChange={onInputChange}
                name="password"
                value={password}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg login-button"
                disabled={submitted}
              >
                {submitted ? "granting access....." : "login"}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </LoginStyle>
  );
};

export default Login;
