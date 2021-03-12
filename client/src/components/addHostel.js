import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { GetAllFaculties } from "../graphql/queries";
import { CreateHall } from "../graphql/mutation";
import CurrencyInput from "react-currency-input";
import Loading from "./common/loading";
import Modal from "react-modal";

const facultyArrayFunction = (array, facultyName) => {
  if (array.length == 0) return [];
  const remainElement = array.filter(
    (ele) => ele.facultyName.toUpperCase() != facultyName.toUpperCase()
  );
  return remainElement;
};

const customStylesAddHostel = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "500px",
  },
};

const HostelStyles = styled.div`
  .selFaculty {
    margin: 20px 0;
  }

  .selLevel {
    padding-bottom: 60px;
  }

  .selected_faculty {
    border: 1px solid #c0c0c0;
    padding: 10px;
    margin: 2px;
    color: rebeccapurple;
    font-weight: bold;
    display: inline-block;
    span {
      padding: 5px;
      color: #084627;
    }
  }
  .selected_faculty:last-child {
    margin-bottom: 20px;
  }
  .div_faculty_hostel{
    display: inline-block;
  }
`;

const AddHostel = ( {hostel}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isspecial, setIsSpecial] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [errors, setErrors] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [hostelFees, setHostelFees] = useState(0);
  const [hostelName, setHostelName] = useState("");
  const [hostelType, setHostelType] = useState("");
  const [hostelLocation, setHostelLocation] = useState("");
  const { loading, error, data } = useQuery(GetAllFaculties);
  const [addHostelMutation, addHostelResult] = useMutation(CreateHall);
  const [openModal, setOpenModal] = useState(false);
  const [specialFaculty, setSpecialFaculty] = useState(null);
  const [specialFacultyArray, setSpecialFacultyArray] = useState([]);

  Modal.setAppElement("#root");

  useEffect(() => {
    if (addHostelResult.error) {
      setErrors(addHostelResult.error);
      setSubmitted(false);
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
      setIsSpecial(false);
      setSpecialFacultyArray([]);
      setSpecialFaculty(null);
    }
  }, [addHostelResult.error, addHostelResult.data]);

  useEffect(() => {
    if (error) {
      setErrors(error);
    }
    if (data) {
      setFaculties(data.allFaculties);
    }
  }, [error, data]);

  const removeValue = (arr, value) => {
    const filterArray = arr.filter((ele) => ele !== value);
    return filterArray;
  };

  const removeObjectValue = (arr, key, obj) => {
    const filterArray = arr.filter((ele) => ele[key] !== obj[key]);
    return filterArray;
  };

  const removeselectedLevel = (value) => {
    setSelectedLevel((prevValue) => removeValue(prevValue, value));
  };

  const removeselectedFaculty = ({ key, obj }) => {
    setSpecialFacultyArray((prevValue) =>
      removeObjectValue(prevValue, key, obj)
    );
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
    if (isspecial) {
      setOpenModal(true);
      setSpecialFaculty(value);
    }
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
      if (specialFacultyArray.length < 0) {
        alert("please select the faculties that will occupy the hostel");
      }
    }
    const confirmData = window.confirm(`please confirm the following information. \n
                                        Hostel Name: ${hostelName}
                                        type: ${hostelType}
                                        location: ${hostelLocation}
                                        fees: ${hostelFees}
                                        ${
                                          isspecial
                                            ? specialFacultyArray.map((val) => {
                                                return `${val.facultyName} 
                                                
                                                `;
                                              })
                                            : ""
                                        }
                                        ${
                                          isspecial &&
                                          specialFacultyArray.length > 0
                                            ? specialFacultyArray.map(
                                                ({ levels }) => {
                                                  return levels.map((val) => {
                                                    return `${val}`;
                                                  });
                                                }
                                              )
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
      occupiedBy: isspecial ? specialFacultyArray : null,
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

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleSelectedLevelAndFaculty = () => {
    if (selectedLevel.length == 0) {
      setOpenModal(false);
      return;
    }
    let remainElement = facultyArrayFunction(
      specialFacultyArray,
      specialFaculty
    );

    const obj = {
      facultyName: specialFaculty,
      levels: selectedLevel,
    };
    remainElement.push(obj);
    setSpecialFacultyArray(remainElement);
    //clear the selected level
    setSelectedLevel([]);
    setSpecialFaculty(null);
    setOpenModal(false);
  };

  return (
    <HostelStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="text-center">
            <h3 className="text-info">Create New Student Hostel</h3>
            {errors && <p className="lead text-danger">{errors.message}</p>}
          </div>

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

                {specialFacultyArray.length > 0 ? (
                  <div className="div_faculty_hostel">
                    <p className="text-center lead">Faculties and levels to occupy {hostelName} </p>
                    {specialFacultyArray.map(({ facultyName, levels }) => {
                      return (
                        <div
                          className="selected_faculty"
                          key={facultyName}
                          onClick={() =>
                            removeselectedFaculty({
                              key: facultyName,
                              obj: { facultyName, levels },
                            })
                          }
                        >
                          <p className="text-center">{facultyName}</p>
                          {levels.map((level, index) => {
                            return (
                              <span key={`${index}${level}`}>{level}</span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>no faculty selected </p>
                )}
              </React.Fragment>
            )}
            <div className="text-center">
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

          <Modal
            isOpen={openModal}
            onRequestClose={closeModal}
            style={customStylesAddHostel}
            contentLabel="Add Hostel Level"
            shouldCloseOnOverlayClick={false}
          >
            <div>
              {specialFaculty && <p>{specialFaculty.toUpperCase()}</p>}
              <p>
                <b>Please select the levels that should stay in the hostel</b>
              </p>

              {selectedLevel.length > 0 ? (
                <div className="selLevel">
                  {selectedLevel.map((level) => {
                    return (
                      <p key={level} onClick={() => removeselectedLevel(level)}>
                        {level}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p>no level of student to stay in the hostel selected </p>
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

              <div className="text-center">
                <button
                  className="btn btn-warning"
                  onClick={handleSelectedLevelAndFaculty}
                >
                  saved selected level
                </button>
              </div>

              <p
                className="close-modal"
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "2" + "%",
                  right: "2" + "px",
                }}
              ></p>
            </div>
          </Modal>
        </div>
      </div>
    </HostelStyles>
  );
};

export default AddHostel;
