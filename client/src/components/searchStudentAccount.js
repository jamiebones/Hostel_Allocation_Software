import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ActivateDeactivateUser } from "../graphql/mutation";
import { SearchUserAccount } from "../graphql/queries";
import styled from "styled-components";
import Loading from "./common/loading";
import UsersTable from "./reuseableComponents/usersTable";

const SearchRecordsStyles = styled.div``;

const SearchStudentAccount = () => {
  const [regNumber, setRegNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);
  const [noData, setNoData] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [searchFunc, searchResult] = useLazyQuery(SearchUserAccount);
  const [activateFunction, activateResult] = useMutation(
    ActivateDeactivateUser
  );

  useEffect(() => {
    if (searchResult.data) {
      const users = searchResult.data.searchStudentAccount;
      
      if (users.length > 0) {
        setUsers(users);
        setNoData(false);
      } else {
        setNoData(true);
        setUsers([]);
      }
    }
    if (searchResult.error) {
      setErrors(searchResult.error);
    }
  }, [searchResult.data, searchResult.error]);

  useEffect(() => {
    if (activateResult.data) {
      setSubmitted(!submitted);
      window.alert("successful");
    }
    if (activateResult.error) {
      setSubmitted(!submitted);
      setErrors(activateResult.error);
    }
  }, [activateResult.data, activateResult.error]);

  const performSearchInput = (e) => {
    const value = e.target.value;
    setRegNumber(value);
    if (value.length > 1) {
      //perform query search here
      setTimeout(
        searchFunc({
          variables: {
            regNumber: value,
          },
        }),
        500
      );
    }
  };
  const activateUser = async (userId) => {
    const confirmOperation = window.confirm("please confirm your action");
    if (!confirmOperation) return;
    try {
      setSubmitted(!submitted);
      await activateFunction({
        variables: {
          userId: userId,
        },
        refetchQueries: [
          {
            query: SearchUserAccount,
            variables: {
              regNumber: regNumber,
            },
          },
        ],
      });
    } catch (error) {}
  };
  return (
    <SearchRecordsStyles>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            {searchResult.loading && <Loading />}
            {errors && <p className="lead text-danger">{errors.message}</p>}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form>
            <div className="form-group">
              <label htmlFor="regNumber">Reg Number</label>
              <input
                type="text"
                className="form-control"
                name="regNumber"
                aria-describedby="regNumber"
                value={regNumber}
                onChange={performSearchInput}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            {noData && <p className="lead">Your query returned no result!</p>}

            {users.length > 0 && (
              <UsersTable
                users={users}
                activateUser={activateUser}
                submitted={submitted}
              />
            )}
          </div>
        </div>
      </div>
    </SearchRecordsStyles>
  );
};

export default SearchStudentAccount;
