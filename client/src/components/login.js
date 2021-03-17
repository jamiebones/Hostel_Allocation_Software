import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery } from "@apollo/client";
import { LoginUser } from "../graphql/queries";
import state from "../applicationState";
import { useRecoilState } from "recoil";
import { useHistory } from "react-router-dom";

import store from "store";

const LoginStyle = styled.div``;

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
        setSubmitted(!submitted);
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
        } = loginUserResult.data.loginUser;
        store.set("authToken", token);
        store.set("isAuth", true);
        store.set("currentUser", {
          id,
          userType,
          name,
          email,
          regNumber,
          accessLevel,
        });
        setAuthState(true);
        setCurrentUser({ id, userType, name, email, regNumber, accessLevel });
        setToken(token);
        setSubmitted(!submitted);
        if (accessLevel === "super-admin") {
          history.push("/admin/dashboard");
        } else if (accessLevel === "normal") {
          history.push("/dashboard");
        }
      }
    }
    if (loginUserResult.error) {
      setSubmitted(!submitted);
      setErrors(loginUserResult.error.message);
    }
  }, [loginUserResult.data, loginUserResult.error]);

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(!submitted);
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                id="password"
                onChange={onInputChange}
                name="password"
                value={password}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitted}
              >
                {submitted ? "granting access....." : "login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LoginStyle>
  );
};

export default Login;
