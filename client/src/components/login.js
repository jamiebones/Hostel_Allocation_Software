import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery } from "@apollo/client";
import { ExtractError } from "../modules/utils";
import { LoginUser } from "../graphql/queries";
import ErrorDisplay from "./common/errorDisplay";

import store from "store";

const LoginStyle = styled.div``;

const Login = (props) => {
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  const [executeLogin, loginResult] = useLazyQuery(LoginUser);

  useEffect(() => {
    if (loginResult.data) {
      const {
        id,
        token,
        regNumber,
        email,
        accessLevel,
      } = loginResult.data.loginUser;
      store.set("authToken", token);
      store.set("currentUser", { id, regNumber, email, accessLevel });
      props.loginFunction(loginResult.data.loginUser);
      if (accessLevel) {
        props.history.push("/admin/dashboard");
      } else {
        props.history.push("/dashboard");
      }
    }
    if (loginResult.error) {
      let errors = ExtractError(loginResult.error);
      setErrors(errors);
      setSubmitted(false);
    }
  }, [loginResult.data, loginResult.error]);

  const submitForm = (event) => {
    setSubmitted(true);
    event.preventDefault();
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
          <ErrorDisplay errors={errors} />
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

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitted}
            >
              {submitted ? "granting access....." : "login"}
            </button>
          </form>
        </div>
      </div>
    </LoginStyle>
  );
};

export default Login;
