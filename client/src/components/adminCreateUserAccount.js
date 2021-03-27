import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CreateStaffUserAccountByAdmin } from "../graphql/mutation";
import styled from "styled-components";

const AdminCreateUserAccountStyles = styled.div`
  .title {
    
  }
`;

const AdminCreateUserAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("0");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState(null);
  const [createAccount, createAccountResult] = useMutation(
    CreateStaffUserAccountByAdmin
  );

  useEffect(() => {
    if (createAccountResult.error) {
      setErrors(createAccountResult.error);
      setSubmitted(!submitted);
    }
    if (createAccountResult.data) {
      window.alert("Account created successfully");
      setRole("0");
      setName("");
      setSubmitted(!submitted);
      setPassword("");
      setEmail("");
      setErrors(null);
    }
  }, [createAccountResult.data, createAccountResult.error]);

  const onInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "role":
        if (value !== "0") {
          setRole(value);
        }
        break;
    }
  };

  const createUserAccountFunction = async (e) => {
    e.preventDefault();
    //gather the variables here and
    if (!name) {
      window.alert("name of the account owner is required");
      return;
    }
    if (!email) {
      window.alert("email of the account owner is required");
      return;
    }
    if (!password) {
      window.alert("password of the account owner is required");
      return;
    }
    if (!role) {
      window.alert("the account owner role is a required field");
      return;
    }
    const confirmThings = window.confirm(
      `You are about creating an account with the following details \n Name: ${name} \n Email: ${email} \n Password: ${password} \n Staff Role: ${role}`
    );
    if (!confirmThings) return;
    try {
      setSubmitted(!submitted);
      await createAccount({
        variables: {
          email,
          password,
          name,
          role,
        },
      });
    } catch (error) {}
  };
  return (
    <AdminCreateUserAccountStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="title">
            <h3 className="text-info text-center">Create Staff User Account</h3>
          </div>
          <div className="text-center">
            {errors && <p className="lead text-danger">{errors.message}</p>}
          </div>
          <form onSubmit={createUserAccountFunction}>
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
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                aria-describedby="name"
                value={name}
                onChange={onInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">password</label>
              <input
                type="text"
                className="form-control"
                id="password"
                onChange={onInputChange}
                name="password"
                value={password}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">account role</label>
              <select
                className="form-control"
                name="role"
                onChange={onInputChange}
                value={role}
              >
                <option value="0">select user role</option>
                <option value="admin">admin</option>
                <option value="super-admin">
                  super administrator (access to every thing)
                </option>
                <option value="supervisor">supervisor</option>
              </select>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitted}
              >
                {submitted ? "creating account....." : "create user account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminCreateUserAccountStyles>
  );
};

export default AdminCreateUserAccount;
