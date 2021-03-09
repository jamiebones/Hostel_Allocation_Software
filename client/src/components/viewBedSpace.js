import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { ExtractError } from "../modules/utils";
import { GetHostelByType, GetRoomInHall, BedsInRoom } from "../graphql/queries";
import {
  ChangeBedStatusMutation,
  LockAllBedSpaceMutation,
} from "../graphql/mutation";
import ErrorDisplay from "./common/errorDisplay";
import styled from "styled-components";

const ViewBedSpaceStyles = styled.div`
  table tr > td:first-child {
    font-weight: bold;
    text-align: center;
  }

  table tr > td:nth-child(2) {
    text-align: center;
  }
`;

const ViewBedSpace = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState();
  const [submitted, setSubmitted] = useState(false);

  const [beds, setBeds] = useState([]);

  const [hostelQueries, hostelResult] = useLazyQuery(GetHostelByType);
  const [roomQueries, roomResult] = useLazyQuery(GetRoomInHall);

  const [bedInRoomQuery, bedInRoomQueryResult] = useLazyQuery(BedsInRoom);

  const [changeBedStatusMutation, bedMutationResult] = useMutation(
    ChangeBedStatusMutation
  );

  const [lockAllBedSpace, lockAllBedSpaceResult] = useMutation(
    LockAllBedSpaceMutation
  );

  useEffect(() => {
    if (hostelResult.data) {
      setHostels(hostelResult.data.hallByType);
    }

    if (roomResult.data) {
      setRooms(roomResult.data.roomsInHall);
    }

    if (bedInRoomQueryResult.data) {
      setBeds(bedInRoomQueryResult.data.bedsInRoom);
    }

    if (lockAllBedSpaceResult.data) {
      window.alert("action successful");
    }
  }, [
    hostelResult.data,
    roomResult.data,
    bedInRoomQueryResult.data,
    lockAllBedSpaceResult.data,
  ]);

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
    if (bedMutationResult.error) {
      errorArray = ExtractError(bedMutationResult.error);
      setErrors(errorArray);
    }
    if (bedInRoomQueryResult.error) {
      errorArray = ExtractError(bedInRoomQueryResult.error);
      setErrors(errorArray);
    }
    if (lockAllBedSpaceResult.error) {
      errorArray = ExtractError(lockAllBedSpaceResult.error);
      setErrors(errorArray);
    }
  }, [
    hostelResult.error,
    roomResult.error,
    bedMutationResult.error,
    bedInRoomQueryResult.error,
    lockAllBedSpaceResult.error,
  ]);

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

    bedInRoomQuery({
      variables: {
        roomId: roomId,
      },
    });

    //run lazy queryy here
  };

  const changeRoomStatus = async (e, { bedId }) => {
    const value = e.target.value;
    if (value == "0") return;
    try {
      await changeBedStatusMutation({
        variables: {
          newStatus: value,
          roomId: currentRoomId,
          bedId,
        },
        refetchQueries: [
          {
            query: BedsInRoom,
            variables: {
              roomId: currentRoomId,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLockRoom = async (e) => {
    e.preventDefault();
    try {
      setSubmitted(!submitted);
      await lockAllBedSpace({
        variables: {
          roomId: currentRoomId,
        },
        refetchQueries: [
          {
            query: BedsInRoom,
            variables: {
              roomId: currentRoomId,
            },
          },
        ],
      });
      setSubmitted(false);
    } catch (error) {
      setSubmitted(!submitted);
      console.log(error);
    }
  };

  return (
    <ViewBedSpaceStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ErrorDisplay errors={errors} />
          <div className="form-group">
            <label>Hostel Type</label>
            <select className="custom-select" onChange={hostelTypeChange}>
              <option value="0">hostel type</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hostel/Hall</label>
            <select className="custom-select" onChange={hostelChange}>
              <option value="0">select hostel</option>
              {hostels.length > 0 &&
                hostels.map(({ id, hallName }) => {
                  return (
                    <option value={id} key={id}>
                      {hallName}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="form-group">
            <label>Hostel Fees</label>
            <select className="custom-select" onChange={filterRooms}>
              <option value="0">select room</option>
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

      <div className="row">
        <div className="col-md-6 offset-md-3 mb-3 mt-3">
          {currentRoom && (
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th scope="col" colSpan="2" className="text-center">
                    Room Details
                    <div className="float-right">
                      <button
                        disabled={submitted ? true : false}
                        className="btn btn-danger"
                        onClick={handleLockRoom}
                      >
                        {submitted ? "locking rooms........" : " lock rooms"}
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hostel/Hall:</td>
                  <td>{currentRoom.hallName}</td>
                </tr>
                <tr>
                  <td>Location:</td>
                  <td>{currentRoom.location}</td>
                </tr>

                <tr>
                  <td>Room number:</td>
                  <td>{currentRoom.roomNumber}</td>
                </tr>

                <tr>
                  <td> Room type:</td>
                  <td>{currentRoom.roomType}</td>
                </tr>

                <tr>
                  <td>Total space: </td>
                  <td>{currentRoom.totalBedSpace}</td>
                </tr>

                <tr>
                  <td>Vacant space: </td>
                  <td>{currentRoom.vacantSpace}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          {beds.length > 0 && (
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Bed space</th>
                  <th scope="col">Bed status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {beds.map(({ bedStatus, bedNumber, id }, i) => {
                  return (
                    <tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>{bedNumber}</td>
                      <td>{bedStatus}</td>
                      <td>
                        <select
                          className="custom-select"
                          onChange={(e) =>
                            changeRoomStatus(e, {
                              bedId: id,
                            })
                          }
                        >
                          <option value="0">change room status</option>
                          <option value="locked">locked</option>
                          <option value="reserved">reserved</option>
                          <option value="vacant">unlock</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ViewBedSpaceStyles>
  );
};

export default ViewBedSpace;
