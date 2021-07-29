import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import {
  DeactivateSessionMutation,
  ActivateSessionMutation,
} from "../graphql/mutation";
import { AllSessions } from "../graphql/queries";
import { ExtractError } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";

const ActivateSessionStyles = styled.div``;

const ActivateSession = ({ history }) => {
  const [session, setSession] = useState([]);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const { loading, error, data } = useQuery(AllSessions);
  const [activateSession, activateSessionResult] = useMutation(
    ActivateSessionMutation
  );
  const [deactivateSession, deactivateSessionResult] = useMutation(
    DeactivateSessionMutation
  );

  useEffect(() => {
    if (error) {
      setErrors(ExtractError(error));
    }
    if (data) {
      setSession(data.allSessions);
    }
  }, [error, data]);

  useEffect(() => {
    if (activateSessionResult.error) {
      setErrors(ExtractError(activateSessionResult.error));
      setSubmitted(false);
    }
    if (deactivateSessionResult.error) {
      setErrors(ExtractError(deactivateSessionResult.error));
      setSubmitted(false);
    }
    if (activateSessionResult.data || deactivateSessionResult.data) {
      setSubmitted(false);
    }
  }, [
    activateSessionResult.error,
    activateSessionResult.data,
    deactivateSessionResult.error,
    deactivateSessionResult.data,
  ]);

  const handleActivateSession = async (sessionId) => {
    try {
      setSubmitted(true);
      await activateSession({
        variables: {
          sessionId,
        },
        refetchQueries: [
          {
            query: AllSessions,
          },
        ],
      });
      setSubmitted(!submitted);
    } catch (error) {
      setSubmitted(!submitted);
      //handle error here
      console.log(error);
    }
  };

  const handleDeactivateSession = async (sessionId) => {
    try {
      setSubmitted(true);
      await deactivateSession({
        variables: {
          sessionId,
        },
        refetchQueries: [
          {
            query: AllSessions,
          },
        ],
      });
      setSubmitted(!submitted);
    } catch (error) {
      setSubmitted(!submitted);
      //handle error here
      console.log(error);
    }
  };

  return (
    <ActivateSessionStyles>
      <div className="row">
        <div className="col-md-12">
          <ErrorDisplay errors={errors} />
          {loading ? (
            <Loading />
          ) : (
            <div>
              {session && session.length > 0 ? (
                <div className="table-responsive">
                  {/* /we loop here */}

                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Session</th>
                        <th scope="col">Faculty Allocation</th>
                        <th scope="col">Level Allocation</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.map(
                        ({
                          id,
                          facultyAllocation,
                          levelAllocation,
                          session,
                          active,
                        }) => {
                          return (
                            <tr
                              key={id}
                              className={
                                active ? "table-success" : "table-secondary"
                              }
                            >
                              <td>
                                <p>{session}</p>
                              </td>
                              <td>
                                {facultyAllocation.map(
                                  ({
                                    facultyName,
                                    facultyId,
                                    percentAllocation,
                                  }) => {
                                    return (
                                      <p key={facultyId}>
                                        {" "}
                                        {facultyName} - {percentAllocation}
                                      </p>
                                    );
                                  }
                                )}
                              </td>

                              <td>
                                {levelAllocation.map(
                                  ({ level, percentAllocation }) => {
                                    return (
                                      <p key={level}>
                                        {" "}
                                        {level} - {percentAllocation}
                                      </p>
                                    );
                                  }
                                )}
                              </td>

                              <td>
                                {active ? (
                                  <div
                                    className="btn-group"
                                    role="group"
                                    aria-label="Basic example"
                                  >
                                    <button
                                      disabled={submitted}
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        handleDeactivateSession(id)
                                      }
                                    >
                                      Deactivate
                                    </button>

                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() =>
                                        history.push(`/update_session/${id}`)
                                      }
                                    >
                                      Update session
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    className="btn-group"
                                    role="group"
                                    aria-label="Basic example"
                                  >
                                    <button
                                      disabled={submitted}
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleActivateSession(id)}
                                    >
                                      Activate
                                    </button>

                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() =>
                                        history.push(`/update_session/${id}`)
                                      }
                                    >
                                      Update session
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  <p>No session data entered into the system yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ActivateSessionStyles>
  );
};

export default ActivateSession;
