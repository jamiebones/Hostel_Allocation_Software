import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { UpdateSessionMutation } from "../graphql/mutation";
import { GetAllFaculties, GetSessionById } from "../graphql/queries";
import { ExtractError } from "../modules/utils";
import FacultyComponent from "./reuseableComponents/facultyAllocationComponent";
import LevelComponent from "./reuseableComponents/levelAllocationComponent";
import { FaTrashAlt } from "react-icons/fa";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";

import styled from "styled-components";

const SessionStyles = styled.div`
  .sessionSelect {
  }
  .fac-container {
    display: flex;
    flex-wrap: wrap;

    padding: 20px 30px;
    .delete {
      align-self: center;
    }
  }

  .div-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
  }
`;

export default ({ history, match }) => {
  const [facValue, setFacValue] = useState([]);
  const [levelValue, setLevelValue] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loadingData, setLoading] = useState(false);
  const [facComponents, setFacComponents] = useState([]);
  const [levelComponents, setLevelComponents] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessionShouldUpdate, setSessionShouldUpdate] = useState(false);

  const [sessionMutation, sessionResult] = useMutation(UpdateSessionMutation);

  const [getSessionQuery, getSessionResult] = useLazyQuery(GetSessionById);

  const { loading, error, data } = useQuery(GetAllFaculties);

  useEffect(() => {
    if (getSessionResult.error) {
      setErrors(ExtractError(getSessionResult.error));
    }
    if (getSessionResult.loading) {
      setLoading(true);
    }
    if (getSessionResult.data) {
      setLoading(false);
      const sessionData = getSessionResult.data.getSessionById;
      const {
        id,
        shouldUpdateLevel,
        facultyAllocation,
        levelAllocation,
      } = sessionData;
      let facultyAllocationComponentsArray = [];
      let levelAllocationComponentsArray = [];
      facultyAllocation.map(({ facultyId, facultyName, percentAllocation }) => {
        const obj = {
          faculty: facultyName,
          facultyId,
          value: percentAllocation,
        };
        facultyAllocationComponentsArray.push(obj);
      });
      levelAllocation.map(({ level, percentAllocation }) => {
        const obj = {
          level,
          value: percentAllocation,
        };
        levelAllocationComponentsArray.push(obj);
      });
      setFacComponents(facultyAllocationComponentsArray);
      setLevelComponents(levelAllocationComponentsArray);
      setSessionId(id);
      setSessionShouldUpdate(shouldUpdateLevel);
      setFacValue(() =>
        filterArrayForTotal(facultyAllocationComponentsArray, null, "faculty")
      );
      setLevelValue(() =>
        filterArrayForTotal(levelAllocationComponentsArray, null, "level")
      );
    }
  }, [getSessionResult.error, getSessionResult.data, getSessionResult.loading]);

  useEffect(() => {
    if (sessionResult.error) {
      setErrors(ExtractError(sessionResult.error));
      setSubmitted((value) => !value);
    }
    if (sessionResult.data) {
      setSubmitted((value) => !value);
      alert("update successful....");
      history.push("/activate_session");
    }
  }, [sessionResult]);

  useEffect(() => {
    const { sessionId } = match.params;
    getSessionQuery({
      variables: {
        sessionId: sessionId,
      },
    });
  }, []);

  useEffect(() => {
    if (error) {
      setErrors(ExtractError(error));
    }
    if (data) {
      setFaculties(data.allFaculties);
    }
  }, [error, data]);

  const filterArrayComponent = (array = [], value, option) => {
    let newArray = [];
    array.map((ele) => {
      if (ele[option] === value[option]) {
        newArray.push(value);
      } else {
        newArray.push(ele);
      }
    });
    return newArray;
  };

  const filterArrayForTotal = (array = [], value, option) => {
    if (!value) return array;
    const filteredArray = array.filter((e) => e[option] !== value[option]);
    filteredArray.push(value);
    return filteredArray;
  };

  const totalPercent = (array) => {
    return array.reduce((total, ele) => {
      return (total = total + +ele.value);
    }, 0);
  };

  const handleFacValueChange = (valueObj) => {
    setFacValue((value) => filterArrayForTotal(value, valueObj, "faculty"));
    setFacComponents((prevValue) =>
      filterArrayComponent(prevValue, valueObj, "faculty")
    );
  };

  const handleLevelValueChange = (valueObj) => {
    setLevelValue((value) => filterArrayForTotal(value, valueObj, "level"));
    setLevelComponents((prevValue) =>
      filterArrayComponent(prevValue, valueObj, "level")
    );
  };

  const facultySelectChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;
    const splitFacNameAndId = value.split(":");
    const obj = {
      faculty: splitFacNameAndId[0],
      value: 0,
      facultyId: splitFacNameAndId[1],
    };
    const filterComponents = (array, objectToAdd) => {
      const arr = array.filter((ele) => ele.faculty !== value);
      arr.push(objectToAdd);
      return arr;
    };

    setFacComponents((prevValue) => filterComponents(prevValue, obj));
  };

  const levelSelectChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;
    const obj = {
      level: value,
      value: 0,
    };
    const filterComponents = (array, objectToAdd) => {
      const arr = array.filter((ele) => ele.level !== value);
      arr.push(objectToAdd);
      return arr;
    };

    setLevelComponents((prevValue) => filterComponents(prevValue, obj));
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setSubmitted((value) => !value);
    //gather everything here oh

    const facTotalAllocation = totalPercent(facValue);
    const levelTotalAllocation = totalPercent(levelValue);
    if (facTotalAllocation > 100 || facTotalAllocation < 100) {
      alert("faculties allocation must be equal to 100");
      setSubmitted((value) => !value);
      return;
    }
    if (levelTotalAllocation > 100 || levelTotalAllocation < 100) {
      alert("levels allocation must be equal to 100");
      setSubmitted((value) => !value);
      return;
    }

    let facultyArray = [];
    let levelArray = [];
    let levelConfirmation = "";
    let facultyConfirmation = "";

    facComponents.map(({ faculty, value, facultyId }) => {
      const obj = {
        facultyId,
        facultyName: faculty,
        percentAllocation: +value,
        totalAllocation: 0,
        totalOccupied: 0,
      };
      facultyConfirmation += `${faculty} : ${value}% \n`;
      if (faculty) {
        facultyArray.push(obj);
      }
    });

    levelComponents.map(({ level, value }) => {
      const obj = {
        level,
        percentAllocation: +value,
        totalAllocation: 0,
        totalOccupied: 0,
      };
      levelConfirmation += `${level} : ${value}% \n`;
      levelArray.push(obj);
    });
    let confirmDetails = window.confirm(
      ` ${facultyConfirmation} \n ${levelConfirmation} \n should update level: ${sessionShouldUpdate}`
    );

    if (!confirmDetails) {
      setSubmitted((value) => !value);
      return;
    }

    try {
      let variableToSend = {
        facultyAllocation: facultyArray,
        levelAllocation: levelArray,
        shouldUpdateLevel: sessionShouldUpdate,
      };
      await sessionMutation({
        variables: {
          input: variableToSend,
          sessionId: sessionId,
        },
      });
    } catch (error) {
      setSubmitted((value) => !value);
    }
  };

  const handleLevelDelete = (level) => {
    const remainningLevel = levelComponents.filter((ele) => {
      return ele.level !== level;
    });
    setLevelComponents(remainningLevel);
    setLevelValue(() => filterArrayForTotal(remainningLevel, null, "level"));
  };

  const handleFacultyDelete = (faculty) => {
    const remainningFaculty = facComponents.filter((ele) => {
      return ele.faculty !== faculty;
    });
    setFacComponents(remainningFaculty);
    setFacValue(() => filterArrayForTotal(remainningFaculty, null, "faculty"));
  };

  return (
    <SessionStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ErrorDisplay errors={errors} />
        </div>
      </div>

      {loadingData && <Loading />}

      {!getSessionResult.loading && getSessionResult.data && (
        <form onSubmit={handleSessionSubmit}>
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <p className="lead text-center">updating academic session</p>
              <div className="form-group">
                <label htmlFor="facultySelect">Faculties</label>
                <select
                  className="form-control"
                  id="facultySelect"
                  onChange={facultySelectChange}
                >
                  {loading ? (
                    <option>loading.......</option>
                  ) : (
                    <React.Fragment>
                      <option value="0">select faculty</option>
                      {faculties.map(({ id, facultyName }) => {
                        return (
                          <option key={id} value={`${facultyName}:${id}`}>
                            {facultyName}
                          </option>
                        );
                      })}
                    </React.Fragment>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="levelSelect">Level</label>
                <select
                  className="form-control"
                  id="levelSelect"
                  onChange={levelSelectChange}
                >
                  <option value="0">select level</option>
                  <option value="first year">first year students</option>
                  <option value="final year">final year students</option>
                  <option value="other years">other years student</option>
                </select>
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={sessionShouldUpdate}
                  checked={sessionShouldUpdate}
                  onChange={() =>
                    setSessionShouldUpdate((prevValue) => !prevValue)
                  }
                />
                <label className="form-check-label">Update Student Level</label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="fac-container">
                {facComponents.length > 0 &&
                  facComponents.map(({ faculty, facultyId, value }) => {
                    return (
                      <React.Fragment key={faculty}>
                        <FacultyComponent
                          facultyName={faculty}
                          facultyId={facultyId}
                          value={value}
                          onChange={handleFacValueChange}
                        />
                        <span
                          className="delete"
                          onClick={() => handleFacultyDelete(faculty)}
                        >
                          <FaTrashAlt size="1.5em" color="red" />
                        </span>
                      </React.Fragment>
                    );
                  })}
              </div>

              <p className="float-right lead">
                Faculties Percentage <b>{totalPercent(facValue)}%</b>
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="fac-container">
                {levelComponents.map(({ level, value }) => {
                  return (
                    <React.Fragment key={level}>
                      <LevelComponent
                        level={level}
                        value={value}
                        onChange={handleLevelValueChange}
                      />
                      <span
                        className="delete"
                        onClick={() => handleLevelDelete(level)}
                      >
                        <FaTrashAlt size="1.5em" color="red" />
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>

              <p className="float-right lead">
                Level Percentage : <b>{totalPercent(levelValue)}%</b>
              </p>
            </div>
          </div>

          <div className="div-button">
            <button className="btn btn-success" disabled={submitted}>
              {submitted
                ? `updating session please wait........`
                : `Update Session`}
            </button>
          </div>
        </form>
      )}
    </SessionStyles>
  );
};
