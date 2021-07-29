import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import Loading from "./common/loading";
import { GetLockedBedSpace, GetStudentData } from "../graphql/queries";
import {
  PlaceStudentInHoldBedSpace,
  DashStudentFreeRoom,
} from "../graphql/mutation";

import { CapFirstLetterOfEachWord } from "../modules/utils";
import styled from "styled-components";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import LockedBedSpaceComponent from "./reuseableComponents/lockedBedSpaceComponent";
import Modal from "react-modal";
import { FaTimesCircle } from "react-icons/fa";

const BedStatsTotalStyles = styled.div`
  .close-icon {
    position: absolute;
    top: -10px;
    right: 10px;
    cursor: pointer;
  }
  .bed-display {
    display: flex;
    flex-wrap: wrap;
  }
  .color {
    width: 30px;
    height: 30px;
    display: inline-block;
  }

  .div-wrapper {
    .lead {
      margin-bottom: 1px;
    }
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 200px;
    border: 1px solid gray;
    padding: 2px 3px;
    margin-bottom: 30px;
    background-color: beige;
  }
  .div-panel {
    display: flex;
    justify-content: space-between;
  }
  .div-lock {
    margin-bottom: 30px;
  }
  .accordion__button {
    font-size: 20px;
    font-weight: 300;
  }
  .select {
    margin-bottom: 20px;
    margin-top: 88px;
  }
  .text-dark {
    color: #000;
  }
  .close-modal {
    position: absolute;
    top: 2%;
    right: 2px;
    cursor: pointer;
  }
  .btn-round{
    border-radius: 40px;
  }
`;

const BedStatsTotal = () => {
  const [errors, setErrors] = useState(null);
  const [loadingData, setLoading] = useState(true);
  const [dataArray, setData] = useState([]);
  const [openModalTwo, setOpenModalTwo] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [student, setStudent] = useState(null);
  const [regNumber, setRegNumber] = useState("");

  Modal.setAppElement("#root");

  const { loading, error, data } = useQuery(GetLockedBedSpace);

  const [getStudentDataQuery, getStudentDataResult] =
    useLazyQuery(GetStudentData);

  const [giveRoomToStudentMutation, giveRoomToStudentResult] = useMutation(
    PlaceStudentInHoldBedSpace
  );

  const [giveFreeRoomToStudentMutation, giveFreeRoomToStudentResult] =
    useMutation(DashStudentFreeRoom);

  useEffect(() => {
    if (giveFreeRoomToStudentResult.error) {
      setErrors(giveFreeRoomToStudentResult.error.message);
      setSubmitted(false);
    }

    if (giveFreeRoomToStudentResult.data) {
      alert("The action was successful");
      //close the modal here
      setSubmitted(false);
      setOpenModalTwo(false);
      setSelectedBed(null);
      setStudent(null);
      setErrors(null);
    }
  }, [giveFreeRoomToStudentResult.error, giveFreeRoomToStudentResult.data]);

  useEffect(() => {
    if (giveRoomToStudentResult.error) {
      setErrors(giveRoomToStudentResult.error.message);
      setSubmitted(false);
    }

    if (giveRoomToStudentResult.data) {
      alert("The action was successful");
      //close the modal here
      setSubmitted(false);
      setOpenModalTwo(false);
      setSelectedBed(null);
      setStudent(null);
      setErrors(null);
    }
  }, [giveRoomToStudentResult.error, giveRoomToStudentResult.data]);

  useEffect(() => {
    if (getStudentDataResult.error) {
      setErrors(getStudentDataResult.error.message);
      setSubmitted(false);
    }

    if (getStudentDataResult.data) {
      setStudent(getStudentDataResult.data.studentData);
      setSubmitted(false);
      setErrors(null);
    }
  }, [getStudentDataResult.error, getStudentDataResult.data]);

  const customStyles2 = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      height: "100%",
      backgroundColor: "#f0ffff",
    },
  };

  useEffect(() => {
    if (data) {
      setData(data.getLockedBedSpace);
      setLoading(!loadingData);
      setSubmitted(false);
      setErrors(null);
    }

    if (error) {
      setErrors(error.message);
      setLoading(!loadingData);
      setSubmitted(false);
    }
  }, [error, data]);

  const handleModalTwoClose = () => {
    setOpenModalTwo(false);
  };

  const handleBedSelect = ({ bed, location, room, roomType, hallName }) => {
    const bedDetails = {
      bed,
      location,
      room,
      roomType,
      hallName,
    };
    setSelectedBed(bedDetails);
    setOpenModalTwo(true);
  };

  const handleGetStudentData = (e) => {
    e.preventDefault();
    setSubmitted(true);
    getStudentDataQuery({
      variables: {
        regNumber: regNumber,
      },
    });
  };

  const handleRegNumberChange = (e) => {
    const value = e.target.value;
    setRegNumber(value);
  };

  const handleStudentRoomPlacement = async () => {
    try {
      const confirmTask = window.confirm(
        `You are about placing ${regNumber.toUpperCase()} into ${CapFirstLetterOfEachWord(
          selectedBed.bed.bedNumber
        )} \n
         in room ${CapFirstLetterOfEachWord(
           selectedBed.room
         )} of ${CapFirstLetterOfEachWord(
          selectedBed.hallName
        )} hostel in ${CapFirstLetterOfEachWord(selectedBed.location)}.\n
         Please confirm your action. This action is irreversible and \n
         it will be logged for accountability sake.`
      );
      if (!confirmTask) return;
      if (student.sex.toLowerCase() !== selectedBed.roomType.toLowerCase()) {
        alert(
          `You can not put a ${student.sex} student into a ${selectedBed.roomType} hostel.`
        );
        return;
      }
      setSubmitted(true);
      await giveRoomToStudentMutation({
        variables: {
          bedId: selectedBed.bed.bedId,
          regNumber: student.regNumber,
        },
        refetchQueries: [
          {
            query: GetLockedBedSpace,
            variables: {},
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFreeRoomToStudent = async () => {
    try {
      const confirmTask = window.confirm(
        `You are about giving ${regNumber.toUpperCase()} a free bed with number: ${CapFirstLetterOfEachWord(
          selectedBed.bed.bedNumber
        )} \n
         in room ${CapFirstLetterOfEachWord(
           selectedBed.room
         )} of ${CapFirstLetterOfEachWord(
          selectedBed.hallName
        )} hostel in ${CapFirstLetterOfEachWord(selectedBed.location)}.\n
         Please confirm your action. This action is irreversible and \n
         it will be logged for accountability sake.`
      );
      if (!confirmTask) return;
      if (student.sex.toLowerCase() !== selectedBed.roomType.toLowerCase()) {
        alert(
          `You can not put a ${student.sex} student into a ${selectedBed.roomType} hostel.`
        );
        return;
      }
      setSubmitted(true);
      await giveFreeRoomToStudentMutation({
        variables: {
          bedId: selectedBed.bed.bedId,
          regNumber: student.regNumber,
        },
        refetchQueries: [
          {
            query: GetLockedBedSpace,
            variables: {},
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <BedStatsTotalStyles>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="text-center">
            <p className="lead text-danger">{errors}</p>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-sm-12 col-lg-8">
          {dataArray.length > 0 && (
            <p className="text-center lead">Assign room to student</p>
          )}
          {dataArray.length > 0 ? (
            dataArray.map(({ hallName, rooms, location, roomType }, index) => {
              return (
                <Accordion
                  allowZeroExpanded={true}
                  allowMultipleExpanded={true}
                  key={index + 65775}
                >
                  <AccordionItem>
                    <AccordionItemHeading>
                      <AccordionItemButton key={hallName}>
                        <span>{CapFirstLetterOfEachWord(hallName)}</span>
                        <span
                          className="text-center"
                          style={{
                            margin: 10 + "px",
                          }}
                        >
                          {CapFirstLetterOfEachWord(location)}
                        </span>
                        <span className="float-right">
                          {CapFirstLetterOfEachWord(roomType)}
                        </span>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      {rooms.map(({ room, beds }) => {
                        return (
                          <div className="div-room" key={room}>
                            <p className="lead text-center text-dark">
                              Room Number: {CapFirstLetterOfEachWord(room)}
                              <span className="float-right">
                                Total space : <b>{beds.length}</b>
                              </span>
                            </p>
                            <hr />
                            <div className="bed-display">
                              {beds.map((bed, index) => {
                                return (
                                  <LockedBedSpaceComponent
                                    bed={bed}
                                    key={index}
                                    room={room}
                                    hallName={hallName}
                                    location={location}
                                    roomType={roomType}
                                    handleBedSelect={handleBedSelect}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </AccordionItemPanel>
                  </AccordionItem>
                </Accordion>
              );
            })
          ) : (
            <div>
              {dataArray.length == 0 && (
                <p className="text-center lead">No room is reserved</p>
              )}
            </div>
          )}
        </div>

        <Modal
          isOpen={openModalTwo}
          onRequestClose={handleModalTwoClose}
          style={customStyles2}
          contentLabel="Assign bed to student"
          shouldCloseOnOverlayClick={false}
        >
          <div style={{ marginTop: 50 + "px" }}>
            <div className="text-center">
              <p className="lead text-danger">{errors}</p>
            </div>
            <form onSubmit={handleGetStudentData}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="enter student reg number"
                  className="form-control input"
                  aria-label="student regnumber"
                  onChange={handleRegNumberChange}
                />
                <div className="input-group-append">
                  <button className="btn btn-info">
                    {submitted ? "getting data...." : "get student data"}
                  </button>
                </div>
              </div>
            </form>

            {student && (
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>
                        <p>Student information</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p className="lead">
                          Reg number:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {student.regNumber.toUpperCase()}
                          </span>
                        </p>
                      </td>
                      <td>
                        <p className="lead">
                          Level:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {student.currentLevel}
                          </span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="lead">
                          Dept:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {CapFirstLetterOfEachWord(student.dept)}
                          </span>
                        </p>
                      </td>
                      <td>
                        <p className="lead">
                          Level:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {CapFirstLetterOfEachWord(student.faculty)}
                          </span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="lead">
                          Sex:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {CapFirstLetterOfEachWord(student.sex)}
                          </span>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>
                        <p>Bed details</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p className="lead">
                          Hostel:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {CapFirstLetterOfEachWord(selectedBed.hallName)}
                          </span>
                        </p>
                      </td>
                      <td>
                        <p className="lead">
                          Room number:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {CapFirstLetterOfEachWord(selectedBed.room)}
                          </span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="lead">
                          Location:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {CapFirstLetterOfEachWord(selectedBed.location)}
                          </span>
                        </p>
                      </td>
                      <td>
                        <p className="lead">
                          Hostel type:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {CapFirstLetterOfEachWord(selectedBed.roomType)}
                          </span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="lead">
                          Bed number:
                          <span style={{ paddingLeft: "20" + "px" }}>
                            {selectedBed.bed.bedNumber}
                          </span>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-center">
                  <div className="btn-group" style={{ margin: "60" + "px" }}>
                    <button
                      className="btn btn-success btn-lg btn-round"
                      disabled={submitted}
                      onClick={handleStudentRoomPlacement}
                    >
                      {submitted
                        ? "please wait"
                        : `place bed on hold for ${regNumber.toUpperCase()}`}
                    </button>

                    <button
                      className="btn btn-danger btn-lg btn-round"
                      disabled={submitted}
                      onClick={handleFreeRoomToStudent}
                    >
                      {submitted
                        ? "please wait"
                        : `assign bed space for free to ${regNumber.toUpperCase()}`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p
            className="close-modal"
            onClick={handleModalTwoClose}
            style={{
              position: "absolute",
              top: "2" + "%",
              right: "2" + "px",
              cursor: "pointer",
            }}
          >
            <FaTimesCircle size="1.6rem" color="blue" />
          </p>
        </Modal>
      </div>
    </BedStatsTotalStyles>
  );
};

export default BedStatsTotal;
