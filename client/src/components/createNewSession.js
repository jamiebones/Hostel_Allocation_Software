import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { CreateNewSessionMutation } from "../graphql/mutation";
import {
  GetAllFaculties,
  GetSessionById,
  TotalAndReservedBedStatistic,
} from "../graphql/queries";
import { ExtractError, IncrementSession } from "../modules/utils";
import FacultyComponent from "./reuseableComponents/facultyAllocationComponent";
import LevelComponent from "./reuseableComponents/levelAllocationComponent";
import { FaTrashAlt } from "react-icons/fa";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";
import NumberFormat from "react-number-format";

import styled from "styled-components";

const SessionStyles = styled.div`
  .fac-container {
    display: flex;
    width: 47vw;
    justify-content: space-around;

    .deleteDiv {
      display: flex;
      padding-left: 10px;
    }
  }

  p span {
    float: right;
  }

  p {
    font-size: 17px;
  }

  .div-marginUp {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 150px;
    background-color: gray;
  }

  .div-level {
    border-left: 5px solid #c1dce8;
  }
  .result-board {
    border: 2px solid #c0c0c0;
    padding: 20px;
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .button-div {
    margin-bottom: 80px;
  }

  @media all and (max-width: 700px) {
    .result-board {
      margin: 0px;
      margin-top: 50px;
    }

    .div-level {
      border: 0;
    }
    .fac-container {
      width: 550px;
    }
  }
`;

export default (props) => {
  const [facValue, setFacValue] = useState([]);
  const [levelValue, setLevelValue] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [errors, setErrors] = useState([]);
  const [allocatedArray, setAllocatedArray] = useState([]);
  const [allocatedArrayLevel, setAllocatedArrayLevel] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [bedspaceStats, setBedSpaceStats] = useState(null);
  const [sessionText, setSessionText] = useState("");

  const subtractTwoNumbers = (a, b) => {
    const answer = +a - +b;
    return answer;
  };

  const [facComponents, setFacComponents] = useState([]);
  const [levelComponents, setLevelComponents] = useState([]);

  const [submitted, setSubmitted] = useState(false);
  const [session, setSession] = useState("");

  const [sessionMutation, sessionResult] = useMutation(
    CreateNewSessionMutation
  );

  const { loading, error, data } = useQuery(GetAllFaculties);
  const statsQuery = useQuery(TotalAndReservedBedStatistic);

  useEffect(() => {
    if (statsQuery.loading) {
      setLoadingState(true);
    }

    if (statsQuery.error) {
      setLoadingState(false);
      setErrors(ExtractError(statsQuery.error));
    }

    if (statsQuery.data) {
      setLoadingState(false);
      setBedSpaceStats(statsQuery.data.getBedStatistic);
    }
  }, [statsQuery.data]);

  useEffect(() => {
    if (sessionResult.error) {
      setSubmitted(!submitted);
      setErrors(ExtractError(sessionResult.error));
    }
    if (sessionResult.data) {
      setSubmitted(false);
      alert(`${session} academic session created successfully`);
    }
  }, [sessionResult.error, sessionResult]);

  useEffect(() => {
    if (error) {
      setErrors(ExtractError(error));
    }
    if (data) {
      setFaculties(data.allFaculties);
    }
  }, [error, data]);

  const filterArrayComponent = (array = [], value, option) => {
    if (!value) return array;
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

  const filterAllocationStats = (array = [], newStat) => {
    const newArray = [...array];
    let newestArray = [];
    if (newArray.length == 0) {
      newestArray.push(newStat);
      return newestArray;
    } else {
      const remainArray = newArray.filter((e) => {
        return e["label"] != newStat["label"];
      });
      const returnArray = [...remainArray, newStat];
      return returnArray;
    }
  };

  const filterArrayForTotal = (array = [], value, option) => {
    const filteredArray = array.filter((e) => e[option] !== value[option]);
    filteredArray.push(value);
    return filteredArray;
  };

  const totalPercent = (array, option) => {
    //option is given when calculating the field being calculated
    //is not value
    if (array.length == 0) return;
    return array.reduce((total, ele) => {
      if (ele) {
        if (option) {
          return (total = total + +ele[option]);
        } else {
          return (total = total + +ele.value);
        }
      }
      return (total = total + 0);
    }, 0);
  };

  const calculateTotalSpaceByPercentage = (total, percent, label) => {
    const calculatedTotal = Math.floor((percent / 100) * total);
    return {
      label,
      calculatedTotal,
    };
  };

  const handleFacValueChange = (valueObj) => {
    const { faculty, value } = valueObj;
    setFacValue((value) => filterArrayForTotal(value, valueObj, "faculty"));
    setFacComponents((prevValue) =>
      filterArrayComponent(prevValue, valueObj, "faculty")
    );
    //add the computed array values here
    const spaces = calculateTotalSpaceByPercentage(
      subtractTwoNumbers(bedspaceStats.totalSpace, bedspaceStats.reservedSpace),
      value,
      faculty
    );
    //add it to the array of values and update if posible.
    setAllocatedArray((prevStatsValue) =>
      filterAllocationStats(prevStatsValue, spaces)
    );
  };

  const handleLevelValueChange = (valueObj) => {
    const { level, value } = valueObj;
    setLevelValue((value) => filterArrayForTotal(value, valueObj, "level"));
    setLevelComponents((prevValue) =>
      filterArrayComponent(prevValue, valueObj, "level")
    );
    const spaces = calculateTotalSpaceByPercentage(
      subtractTwoNumbers(bedspaceStats.totalSpace, bedspaceStats.reservedSpace),
      value,
      level
    );
    //add it to the array of values and update if posible.
    setAllocatedArrayLevel((prevStatsValue) =>
      filterAllocationStats(prevStatsValue, spaces)
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
      const arr = array.filter((ele) => {
        return ele.faculty !== splitFacNameAndId[0];
      });

      arr.push(objectToAdd);
      return arr;
    };

    setFacComponents((prevValue) => filterComponents(prevValue, obj));
  };

  const levelSelectChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const obj = {
      level: value,
      value: 0,
    };
    const filterComponentsByLevel = (array, objectToAdd) => {
      const arr = array.filter((ele) => {
        return ele.level !== value;
      });
      arr.push(objectToAdd);
      return arr;
    };

    setLevelComponents((prev) => filterComponentsByLevel(prev, obj));
  };

  const handleSessionSubmit = async (e) => {
    //check if bedstats is not null
    e.preventDefault();
    const remainingSpace = subtractTwoNumbers(
      bedspaceStats.totalSpace,
      bedspaceStats.reservedSpace
    );
    if (remainingSpace == 0) return;
    setSubmitted((value) => !value);
    //gather everything here oh
    if (!session) {
      setSubmitted((value) => !value);
      alert("please select the academic session");
      return;
    }
    const facTotalAllocation = totalPercent(facValue);
    const levelTotalAllocation = totalPercent(levelValue);
    if (
      facTotalAllocation > 100 ||
      facTotalAllocation < 100 ||
      facTotalAllocation == undefined
    ) {
      alert("faculties allocation must be equal to 100");
      setSubmitted((value) => !value);
      return;
    }
    if (
      levelTotalAllocation > 100 ||
      levelTotalAllocation < 100 ||
      levelTotalAllocation == undefined
    ) {
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
      `session: ${session} \n ${facultyConfirmation} \n ${levelConfirmation}`
    );

    if (!confirmDetails) {
      setSubmitted((value) => !value);
      return;
    }

    try {
      let varableToSend = {
        session,
        facultyAllocation: facultyArray,
        levelAllocation: levelArray,
        active: false,
      };
      await sessionMutation({
        variables: {
          input: varableToSend,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLevelDelete = (level) => {
    const remainningLevel = levelComponents.filter((ele) => {
      return ele.level !== level;
    });
    const remainningLevelAllocation = allocatedArrayLevel.filter((ele) => {
      return ele.label !== level;
    });
    setLevelComponents(remainningLevel);
    setLevelValue(() => remainningLevel);
    setAllocatedArrayLevel(remainningLevelAllocation);
    //setLevelValue(() => filterArrayForTotal(remainningLevel, null, "level"));
  };

  const handleFacultyDelete = (faculty) => {
    const remainningFaculty = facComponents.filter((ele) => {
      return ele.faculty !== faculty;
    });
    const remainningFacAllocation = allocatedArray.filter((ele) => {
      return ele.label !== faculty;
    });

    setFacComponents(remainningFaculty);
    setFacValue(() => remainningFaculty);
    setAllocatedArray(remainningFacAllocation);
  };

  const handleTextValueChange = (value) => {
    setSessionText(value.formattedValue);
    setSession(value.formattedValue);
  };

  return (
    <SessionStyles>
      <div className="col-md-11 offset-md-1">
        <div className="text-center">
          <ErrorDisplay errors={errors} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          {loadingState ? (
            <Loading />
          ) : (
            <React.Fragment>
              <form onSubmit={handleSessionSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="sessionSelect">Academic Session</label>
                      <NumberFormat
                        className="form-control"
                        id="sessionSelect"
                        value={sessionText}
                        format="####/####"
                        onValueChange={handleTextValueChange}
                        value={sessionText}
                      />
                    </div>

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

                    <div>
                      {facComponents.length > 0 &&
                        facComponents.map(({ faculty, facultyId }) => {
                          return (
                            <React.Fragment key={faculty}>
                              <div className="fac-container">
                                <FacultyComponent
                                  facultyName={faculty}
                                  facultyId={facultyId}
                                  onChange={handleFacValueChange}
                                />

                                <div className="deleteDiv">
                                  <span
                                    className="delete"
                                    onClick={() => handleFacultyDelete(faculty)}
                                  >
                                    <FaTrashAlt size="1.5em" color="red" />
                                  </span>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      <p className="float-right lead">
                        Faculties Percentage <b>{totalPercent(facValue)}%</b>
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="result-board">
                      <p className="text-center lead text-info">
                        Allocation Stats
                      </p>

                      <p>
                        Total beds :
                        <span>{bedspaceStats && bedspaceStats.totalSpace}</span>
                      </p>

                      <p>
                        Avaliable spaces:
                        {bedspaceStats && (
                          <span>
                            {subtractTwoNumbers(
                              bedspaceStats.totalSpace,
                              bedspaceStats.reservedSpace
                            )}
                          </span>
                        )}
                      </p>
                      <p>
                        Locked beds:
                        <span>
                          {bedspaceStats && bedspaceStats.reservedSpace}
                        </span>
                      </p>

                      {allocatedArray.length > 0 && (
                        <p className="text-center lead text-info">
                          Faculties Allocation
                        </p>
                      )}

                      {allocatedArray &&
                        allocatedArray.map(({ label, calculatedTotal }) => {
                          return (
                            <p key={label}>
                              {label} :<span>{calculatedTotal}</span>
                            </p>
                          );
                        })}

                      {allocatedArray.length > 0 && (
                        <p>
                          Total:
                          <span>
                            {totalPercent(allocatedArray, "calculatedTotal")}
                          </span>
                        </p>
                      )}

                      {allocatedArrayLevel.length > 0 && (
                        <p className="text-center lead text-info">
                          Level Allocation
                        </p>
                      )}

                      {allocatedArrayLevel &&
                        allocatedArrayLevel.map(
                          ({ label, calculatedTotal }) => {
                            return (
                              <p key={label}>
                                {label} :<span>{calculatedTotal}</span>
                              </p>
                            );
                          }
                        )}

                      {allocatedArrayLevel.length > 0 && (
                        <p>
                          Total:{" "}
                          <span>
                            {totalPercent(
                              allocatedArrayLevel,
                              "calculatedTotal"
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 div-level">
                    {levelComponents.length > 0 &&
                      levelComponents.map(({ level }) => {
                        return (
                          <React.Fragment key={level}>
                            <div className="fac-container">
                              <LevelComponent
                                level={level}
                                onChange={handleLevelValueChange}
                              />
                              <span
                                className="delete"
                                onClick={() => handleLevelDelete(level)}
                              >
                                <FaTrashAlt size="1.5em" color="red" />
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })}

                    <p className="float-right lead">
                      Level Percentage : <b>{totalPercent(levelValue)}%</b>
                    </p>
                  </div>
                </div>

                {bedspaceStats &&
                subtractTwoNumbers(
                  bedspaceStats.totalSpace,
                  bedspaceStats.reservedSpace
                ) != 0 ? (
                  <div className="row">
                    <div className="col-md-12 button-div">
                      <div className="text-center">
                        <button
                          className="btn btn-success btn-lg"
                          disabled={submitted}
                        >
                          {submitted
                            ? "Creating session please wait........"
                            : "Create New Session"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </form>
            </React.Fragment>
          )}
        </div>
      </div>
    </SessionStyles>
  );
};
