import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { GetAllFaculties } from "../graphql/queries";
import { CreateHall } from "../graphql/mutation";
import { ExtractError } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";
import CurrencyInput from "react-currency-input";
import Loading from "./common/loading";

const HostelStyles = styled.div`
  span {
    margin: 0 20px;
    cursor: pointer;
    background: #28888c;
    color: #fff;
    padding: 5px;
  }

  p span:first-child {
    margin: 0 0;
  }

  .selFaculty {
    margin: 20px 0;
  }

  .selLevel {
    padding-bottom: 60px;
  }
  .button-div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const AddHostel = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isspecial, setIsSpecial] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(() => []);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [errors, setErrors] = useState([]);

  const [faculties, setFaculties] = useState([]);
  const [hostelFees, setHostelFees] = useState(0);
  const [hostelName, setHostelName] = useState("");
  const [hostelType, setHostelType] = useState("");
  const [hostelLocation, setHostelLocation] = useState("");

  const { loading, error, data } = useQuery(GetAllFaculties);

  const [addHostelMutation, addHostelResult] = useMutation(CreateHall);

  useEffect(() => {
    if (addHostelResult.error) {
      setErrors(ExtractError(addHostelResult.error));
      setSubmitted((value) => !value);
    }
    if (addHostelResult.data) {
      setSubmitted(false);
      alert(`${hostelName} hostel created `);
      //clear all session data here
      setHostelFees("0");
      setHostelName("");
      setHostelType("");
      setHostelLocation("");
      setSelectedLevel([]);
      setSelectedFaculty([]);
      setIsSpecial(false);
    }
  }, [addHostelResult]);

  useEffect(() => {
    if (error) {
      setErrors(ExtractError(error));
    }
    if (data) {
      setFaculties(data.allFaculties);
    }
  }, [error, data]);

  const removeValue = (arr, value) => {
    const filterArray = arr.filter((ele) => ele !== value);
    return filterArray;
  };

  const removeselectedLevel = (value) => {
    setSelectedLevel((prevValue) => removeValue(prevValue, value));
  };

  const removeselectedFaculty = (value) => {
    setSelectedFaculty((prevValue) => removeValue(prevValue, value));
  };

  const addValueToArray = (arr, value) => {
    const arrayToCheck = [...arr];
    const findValue = arrayToCheck.find((ele) => ele === value);
    if (findValue) return arrayToCheck;
    arrayToCheck.push(value);
    return arrayToCheck;
  };

  const facultySelectChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;
    setSelectedFaculty((prevValue) => addValueToArray(prevValue, value));
  };

  const levelSelectChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;
    setSelectedLevel((prevValue) => addValueToArray(prevValue, value));
  };

  const handleHostelFees = (e, maskedvalue, floatvalue) => {
    setHostelFees(maskedvalue);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (value === "0") return;
    switch (name) {
      case "hostelType":
        setHostelType(value);
        break;
      case "hostelName":
        setHostelName(value);
        break;

      case "hostelLocation":
        setHostelLocation(value);
        break;
    }
  };

  const handleHostelCreation = async (e) => {
    e.preventDefault();
    //gather our values here
    if (!hostelName) {
      alert("hostel name is required ");
      return;
    }
    if (!hostelType) {
      alert("hostel type is required ");
      return;
    }
    if (!hostelLocation) {
      alert("hostel location is required ");
      return;
    }
    if (isspecial) {
      if (selectedFaculty.length < 0) {
        alert("please select the faculties that will occupy the hostel");
      }
      if (selectedLevel.length < 0) {
        alert("please select the level that will occupy the hostel");
      }
    }
    const confirmData = window.confirm(`please confirm the following information. \n
                                        Hostel Name: ${hostelName}
                                        type: ${hostelType}
                                        location: ${hostelLocation}
                                        fees: ${hostelFees}
                                        ${
                                          isspecial
                                            ? selectedFaculty.map((val) => {
                                                return `${val} ||`;
                                              })
                                            : ""
                                        }
                                        ${
                                          isspecial
                                            ? selectedLevel.map((val) => {
                                                return `${val} ||`;
                                              })
                                            : ""
                                        }
    `);
    if (!confirmData) return;
    setSubmitted(true);
    const hostelObject = {
      hallName: hostelName,
      type: hostelType,
      location: hostelLocation,
      status: isspecial ? "special" : "normal",
      occupiedByLevel: isspecial ? selectedLevel : null,
      occupiedBy: isspecial ? selectedFaculty : null,
      hostelFee: hostelFees,
    };
    if (isspecial) {
    }
    try {
      await addHostelMutation({
        variables: {
          ...hostelObject,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HostelStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ErrorDisplay errors={errors} />
          <form onSubmit={handleHostelCreation}>
            <div className="form-group">
              <label htmlFor="hostelName">Hostel Name:</label>
              <input
                type="text"
                className="form-control"
                id="hostelName"
                aria-describedby="hostelHelp"
                name="hostelName"
                value={hostelName}
                onChange={handleChange}
              />
              <small id="hostelHelp" className="form-text text-muted">
                * name of the hostel
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="hostelType">Hostel Type:</label>
              <select
                className="form-control"
                id="hostelType"
                aria-describedby="typeHelp"
                name="hostelType"
                onChange={handleChange}
              >
                <option value="0">select hostel type</option>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
              <small id="typeHelp" className="form-text text-muted">
                * hostel type
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="hostelLocation">Hostel location:</label>
              <select
                className="form-control"
                id="hostelLocation"
                aria-describedby="locationHelp"
                name="hostelLocation"
                onChange={handleChange}
              >
                <option value="0">select hostel location</option>
                <option value="main campus">Main Campus</option>
                <option value="annex campus">Annex Campus</option>
                <option value="town campus">Town Campus</option>
              </select>
              <small id="locationHelp" className="form-text text-muted">
                * select where the hostel is located
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="hostelFees">Hostel Fees:</label>

              <CurrencyInput
                value={hostelFees}
                onChangeEvent={handleHostelFees}
                className="form-control"
              />

              <small id="hostelFeesHelp" className="form-text text-muted">
                * hostel fees
              </small>
            </div>

            <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input"
                value={isspecial}
                onChange={() => setIsSpecial((prevValue) => !prevValue)}
              />
              <label className="form-check-label">
                Check the box if the hostel is special
              </label>
            </div>

            {isspecial && (
              <React.Fragment>
                <div className="form-group">
                  <label htmlFor="facultySelect">Select Faculties</label>
                  <select
                    className="form-control"
                    id="facultySelect"
                    onChange={facultySelectChange}
                  >
                    {loading ? (
                      <option>loading.......</option>
                    ) : (
                      <React.Fragment>
                        <option value="0">select faculties </option>
                        {faculties.map(({ id, facultyName }) => {
                          return (
                            <option key={id} value={facultyName}>
                              {facultyName}
                            </option>
                          );
                        })}
                      </React.Fragment>
                    )}
                  </select>
                </div>

                {selectedFaculty.length > 0 ? (
                  <p className="selFaculty">
                    {selectedFaculty.map((fac) => {
                      return (
                        <span
                          key={fac}
                          onClick={() => removeselectedFaculty(fac)}
                        >
                          {fac}
                        </span>
                      );
                    })}
                  </p>
                ) : (
                  <p>no faculty selected </p>
                )}

                <div className="form-group">
                  <label htmlFor="levelSelect">Select Level</label>
                  <select
                    className="form-control"
                    id="levelSelect"
                    onChange={levelSelectChange}
                  >
                    <option value="0">select level</option>
                    <option className="100 level">100 Level</option>
                    <option className="200 level">200 Level</option>
                    <option className="300 level">300 Level</option>
                    <option className="400 level">400 Level</option>
                    <option className="500 level">500 Level</option>
                    <option className="600 level">600 Level</option>
                  </select>
                </div>

                {selectedLevel.length > 0 ? (
                  <p className="selLevel">
                    {selectedLevel.map((level) => {
                      return (
                        <span
                          key={level}
                          onClick={() => removeselectedLevel(level)}
                        >
                          {level}
                        </span>
                      );
                    })}
                  </p>
                ) : (
                  <p>no level of student to stay in the hostel selected </p>
                )}
              </React.Fragment>
            )}
            <div className="button-div">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitted}
              >
                {submitted
                  ? "please wait.. creating hostel....."
                  : "Create new hostel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </HostelStyles>
  );
};

export default AddHostel;
