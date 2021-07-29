import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ErrorDisplay from "./common/errorDisplay";
import Loading from "./common/loading";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  ExtractError,
  IncrementSessionFiveYears,
  CapFirstLetterOfEachWord,
  ISAuthorizedToView
} from "../modules/utils";
import RoomAllocationComponent from "./roomAllocationComponent";

import {
  GetHostelByType,
  GetRoomInHall,
  GetAllocationByRoom,
} from "../graphql/queries";

const classNames = require("classnames");

const ViewStudentInRoomsStyles = styled.div``;

const ViewStudentInRooms = ({ currentUser }) => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState([]);
  const [session, setSession] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [hostelAllocation, setAllocation] = useState([]);
  const [hasRunQuery, sethasRunQuery] = useState(false);

  const [hostelQueries, hostelResult] = useLazyQuery(GetHostelByType);
  const [roomQueries, roomResult] = useLazyQuery(GetRoomInHall);
  const [printDoc, setPrintDoc] = useState(false);
  const [getAllocationBySession, allocationResult] = useLazyQuery(
    GetAllocationByRoom
  );

  useEffect(() => {
    if (hostelResult.data) {
      setHostels(hostelResult.data.hallByType);
    }

    if (roomResult.data) {
      setRooms(roomResult.data.roomsInHall);
    }

    if (allocationResult.data) {
      setAllocation(allocationResult.data.getAllConfirmedBedAllocationByRoom);
      setSubmitted(!submitted);
    }
  }, [hostelResult.data, roomResult.data, allocationResult.data]);

  useEffect(() => {
    let errorArray = [];
    if (hostelResult.error) {
      errorArray = ExtractError(hostelResult.error);
      setErrors(errorArray);
    }
    if (roomResult.error) {
      errorArray = ExtractError(roomResult.error);
      setErrors(errorArray);
    }
    if (allocationResult.error) {
      errorArray = ExtractError(allocationResult.error);
      setErrors(errorArray);
      setAllocation([]);
      setSubmitted(!submitted);
    }
  }, [hostelResult.error, roomResult.error, allocationResult.error]);

  const hostelTypeChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (value == "0") return;
    hostelQueries({
      variables: { type: value },
    });
  };

  const hostelChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (value == "0") return;
    roomQueries({
      variables: {
        hallId: value,
      },
    });
  };

  const filterRooms = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const parsedRoom = JSON.parse(value);
    setCurrentRoom(parsedRoom);
    const roomId = parsedRoom.id;
    setCurrentRoomId(roomId);
    setSubmitted(!submitted);
    sethasRunQuery(true);
    try {
      getAllocationBySession({
        variables: {
          roomId: roomId,
          session: session,
        },
      });
    } catch (error) {
      console.log(error);
    }

    //run lazy queryy here
  };

  const sessionChange = (e) => {
    const value = e.target.value;
    if (value !== "0") setSession(value);
  };

  const printTable = () => {
    setPrintDoc(true);
    window.print();
    setPrintDoc(false);
  };

  const roomDetailsStyle = classNames({
    "col-md-12 mb-3 mt-3": !printDoc,
    "col-md-6": printDoc,
  });

  return (
    <ViewStudentInRoomsStyles>
      <div className="row d-print-none">
        <div className="col-md-4 offset-md-4">
          <ErrorDisplay errors={errors} />

          <div className="form-group">
            <label>Session</label>
            <select className="custom-select" onChange={sessionChange}>
              {IncrementSessionFiveYears().map(({ value, text }, i) => {
                return (
                  <option value={value} key={i}>
                    {text}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Hostel Type</label>
            <select className="custom-select" onChange={hostelTypeChange}>
              <option value="0">hostel type</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hostel</label>
            <select className="custom-select" onChange={hostelChange}>
              <option value="0">select hostel</option>
              {hostelResult.loading && <option>loading.....</option>}
              {hostels.length > 0 &&
                hostels.map(({ id, hallName }) => {
                  return (
                    <option value={id} key={id}>
                      {CapFirstLetterOfEachWord(hallName)}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="form-group">
            <label>Room</label>
            <select className="custom-select" onChange={filterRooms}>
              <option value="0">select room</option>
              {roomResult.loading && <option>loading.....</option>}
              {rooms.length > 0 &&
                rooms.map((room) => {
                  return (
                    <option value={JSON.stringify(room)} key={room.id}>
                      {room.roomNumber}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </div>

      <div className="printDiv">
        <div className="row">
          <div className={roomDetailsStyle}>
            {currentRoom && (
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th scope="col" colSpan="2" className="text-center">
                      Room Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hostel:</td>
                    <td>{CapFirstLetterOfEachWord(currentRoom.hallName)}</td>
                  </tr>
                  <tr>
                    <td>Location:</td>
                    <td>{CapFirstLetterOfEachWord(currentRoom.location)}</td>
                  </tr>

                  <tr>
                    <td>Room number:</td>
                    <td>{currentRoom.roomNumber}</td>
                  </tr>

                  <tr>
                    <td> Room type:</td>
                    <td>{CapFirstLetterOfEachWord(currentRoom.roomType)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            {submitted && <Loading />}

            {hostelAllocation.length > 0 && hasRunQuery && (
              <div>
                <div>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Student Details</th>
                        <th scope="col">Accomodation Details</th>
                        {ISAuthorizedToView(currentUser, ["super-admin"]) && (
                          <th scope="col">Next of Kin Details</th>
                        )}
                        <th scope="col">Photograph</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hostelAllocation.map((allocation, i) => {
                        return (
                          <tr key={i}>
                            <RoomAllocationComponent
                              allocation={allocation}
                              currentUser={currentUser}
                              index={i}
                            />
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={printTable}
                  className="btn btn-info d-print-none"
                >
                  print list
                </button>
              </div>
            )}

            {!hostelAllocation.length > 0 && hasRunQuery && (
              <div>
                <p>No data to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewStudentInRoomsStyles>
  );
};

export default ViewStudentInRooms;
