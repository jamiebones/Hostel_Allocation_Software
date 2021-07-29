import React, { useState, useEffect } from "react";
import { BedsInRoom } from "../graphql/queries";
import { ChangeBedStatus, LockAllBedSpaceMutation } from "../graphql/mutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import BedSpaceComponent from "./reuseableComponents/bedSpaceComponents";

import styled from "styled-components";

const RoomOperationStyles = styled.div`
  .bed-display {
    display: flex;
    flex-wrap: wrap;
  }

  .color {
    width: 30px;
    height: 30px;

    display: inline-block;
  }
  .locked {
    background-color: green;
  }
  .vacant {
    background-color: blue;
  }
  .occupied {
    background-color: #16bd98;
  }
  .onHold {
    background-color: #c0c0c0;
  }
  .value {
    text-align: center;
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
    margin-bottom: 10px;
    background-color: beige;
  }
  .div-panel {
    display: flex;
    justify-content: space-between;
  }
  .div-lock {
    margin-bottom: 30px;
  }
`;

const RoomOperation = (props) => {
  const [hostelName, setHostelName] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setroomType] = useState("");
  const [errors, setErrors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomId, setRoomId] = useState("");

  const [bedsInRoomQuery, bedsInRoomResult] = useLazyQuery(BedsInRoom);
  const [changeStatusQuery, changeStatusQueryResult] = useMutation(
    ChangeBedStatus
  );
  const [lockRoomsMutation, lockRoomsResult] = useMutation(
    LockAllBedSpaceMutation
  );

  useEffect(() => {
    const hostelId =
      props.location && props.location.state && props.location.state.hallId;
    if (!hostelId) {
      return props.history.push("/view_created_hostels");
    }
    const { hallName, location, roomType, rooms } =
      props.location && props.location.state && props.location.state;
    setHostelName(hallName);
    setLocation(location);
    setroomType(roomType);
    setRooms(rooms);
  }, []);

  useEffect(() => {
    if (changeStatusQueryResult.error) {
      setErrors(ExtractError(changeStatusQueryResult.errror));
      setLoading(false);
    }
    if (changeStatusQueryResult.data) {
      alert("successful");
      setLoading(false);
    }
    if (changeStatusQueryResult.loading) {
      setLoading(true);
    }
  }, [
    changeStatusQueryResult.error,
    changeStatusQueryResult.data,
    changeStatusQueryResult.loading,
  ]);

  useEffect(() => {
    if (bedsInRoomResult.error) {
      setErrors(ExtractError(bedsInRoomResult.errror));
      setLoading(false);
    }
    if (bedsInRoomResult.data) {
      const beds = bedsInRoomResult.data.bedsInRoom;
      setBeds(beds);
      setLoading(false);
    }
    if (bedsInRoomResult.loading) {
      setLoading(true);
    }
  }, [bedsInRoomResult.error, bedsInRoomResult.data, bedsInRoomResult.loading]);

  useEffect(() => {
    if (changeStatusQueryResult.error) {
      setErrors(ExtractError(changeStatusQueryResult.errror));
      setLoading(false);
    }
    if (lockRoomsResult.data) {
      alert(
        `allbed spaces in room number ${roomNumber} in ${CapFirstLetterOfEachWord(
          hostelName
        )} locked`
      );
      setLoading(false);
    }
    if (lockRoomsResult.loading) {
      setLoading(true);
    }
  }, [lockRoomsResult.error, lockRoomsResult.data, lockRoomsResult.loading]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;
    //bedsInRoom
    try {
      const splitValue = value.split(":");
      setRoomNumber(splitValue[1]);
      setRoomId(splitValue[0]);
      bedsInRoomQuery({
        variables: {
          roomId: splitValue[0],
        },
      });
    } catch (error) {}
  };

  const handleBedSpaceChange = async ({ newStatus, id }) => {
    try {
      await changeStatusQuery({
        variables: {
          newStatus,
          bedId: id,
        },
        refetchQueries: [
          {
            query: BedsInRoom,
            variables: {
              roomId: roomId,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLockAllRooms = async () => {
    try {
      const confirmLock = window.confirm(
        `You are about locking all bed space in ${roomNumber} in ${CapFirstLetterOfEachWord(
          hostelName
        )} hostel. This action will lock all the rooms. Please confirm....`
      );
      if (!confirmLock) return;
      await lockRoomsMutation({
        variables: {
          roomId,
        },
        refetchQueries: [
          {
            query: BedsInRoom,
            variables: {
              roomId: roomId,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RoomOperationStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ErrorDisplay errors={errors} />

          <div>
            <div className="float-left">
              <p className="lead">
                Hostel : {CapFirstLetterOfEachWord(hostelName)}
              </p>

              <p className="lead">
                Location: {CapFirstLetterOfEachWord(location)}
              </p>

              <p className="lead">
                Hostel Type: {CapFirstLetterOfEachWord(roomType)}
              </p>
            </div>

            <div className="div-wrapper float-right">
              <p className="text-center lead">
                <b>scale</b>
              </p>
              <div className="div-panel">
                <div className="color vacant"></div>
                <p className="value">vacant</p>
              </div>

              <div className="div-panel">
                <div className="color locked"></div>
                <p className="value">locked</p>
              </div>

              <div className="div-panel">
                <div className="color occupied"></div>
                <p className="value">occupied</p>
              </div>
              <div className="div-panel">
                <div className="color onHold"></div>
                <p className="value">on hold</p>
              </div>
            </div>
          </div>

          <form>
            <div className="form-group">
              <select className="custom-select" onChange={handleChange}>
                <option value="0">select room</option>
                {rooms.length > 0 &&
                  rooms.map(({ id, roomNumber }) => {
                    return (
                      <option value={`${id}:${roomNumber}`} key={id}>
                        {roomNumber}
                      </option>
                    );
                  })}
              </select>
            </div>
          </form>
          {loading && (
            <div className="text-center">
              <Loading />
            </div>
          )}
          {beds && (
            <p className="lead text-center">
              {roomNumber && `Room number:  ${roomNumber}`}
            </p>
          )}
          <div className="bed-display">
            {beds &&
              beds.length > 0 &&
              beds.map((bed, index) => {
                return (
                  <BedSpaceComponent
                    key={bed.id}
                    bed={bed}
                    updateFunc={handleBedSpaceChange}
                  />
                );
              })}
          </div>

          {roomNumber && (
            <div className="text-center">
              <div
                className="btn-group div-lock"
                role="group"
                aria-label="Basic example"
              >
                <button className="btn btn-danger" onClick={handleLockAllRooms}>
                  Lock all beds in {roomNumber}
                </button>

                <button
                  className="btn btn-info"
                  onClick={() => props.history.push("/view_created_hostels")}
                >
                  go back to hostel view
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoomOperationStyles>
  );
};

export default RoomOperation;
