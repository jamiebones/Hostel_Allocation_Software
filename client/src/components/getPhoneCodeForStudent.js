import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GetPhoneCodeByRegNumber } from "../graphql/queries";
import Loading from "./common/loading";
import styled from "styled-components";

const CodeStylesRetrieval = styled.div`
  .code {
    background: #b0b2c7;
    padding: 20px;
    margin-top: 80px;
    font-size: 20px;
  }
`;

const GetPhoneCodeForStudent = () => {
  const [regInput, setRegInput] = useState("");
  const [codeData, setCodeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [codeQueryFunction, codeQueryResult] = useLazyQuery(
    GetPhoneCodeByRegNumber,
    {
      variables: {
        regNumber: regInput,
      },
    }
  );

  useEffect(() => {
    if (codeQueryResult.error) {
      setError(codeQueryResult.error.message);
      setLoading(false);
      setCodeData(null);
    }

    if (codeQueryResult.data) {
      const data = codeQueryResult.data.getPhoneCodeByRegNumber;
      setCodeData(data);
      setLoading(false);
      setError(null);
    }
  }, [codeQueryResult.error, codeQueryResult.data]);

  const handleRegNumberSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (regInput) {
      codeQueryFunction();
    }
  };

  const handleRegInputChange = (e) => {
    const value = e.target.value;
    setRegInput(value);
  };

  return (
    <CodeStylesRetrieval>
      <div className="row">
        <div className="col-md-6 offset-md-3 col-sm-6 offset-sm-3">
          <div className="text-center">
            <h3>Retrieve Phone Code By Reg Number</h3>

            {error && <p className="lead text-danger">{error}</p>}
          </div>
          <form onSubmit={handleRegNumberSubmit}>
            <div className="mb-3">
              <input
                type="text"
                onChange={handleRegInputChange}
                className="form-control"
                value={regInput}
                placeholder="retrieve sent code by reg number"
              />
            </div>

            <div className="float-right mb-3">
              <button type="submit" className="btn btn-success">
                get code
              </button>
            </div>
          </form>

          <div className="text-center">{loading && <Loading />}</div>

          {codeData && (
            <div className="code">
              <p>
                Code <span className="float-right">{codeData.randomCode}</span>
              </p>

              <p>
                Phone Number{" "}
                <span className="float-right">{codeData.phoneNumber}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </CodeStylesRetrieval>
  );
};

export default GetPhoneCodeForStudent;
