import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CreateRoom } from "../graphql/mutation";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";
import ErrorDisplay from "./common/errorDisplay";

import styled from "styled-components";

const RoomStyles = styled.div``;

const CreateRoomInHall = (props) => {
  const [hostelName, setHostelName] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setroomType] = useState("");
  const [singleBed, setSingleBed] = useState(false);
  const [errors, setErrors] = useState([]);
  const [totalBedSpace, settotalBedSpace] = useState("");
  const [roomNumber, setroomNumber] = useState("");
  const [submitted, setsubmitted] = useState(false);

  const [createNewRoomMutation, createNewRoomResult] = useMutation(CreateRoom);

  useEffect(() => {
    if (createNewRoomResult.error) {
      setErrors(ExtractError(createNewRoomResult.error));
      setsubmitted(!submitted);
    }
    if (createNewRoomResult.data) {
      //we push to where we were coming from or we create
      //new roomin the same hostel
      setsubmitted(!submitted);
      setroomNumber("");
      settotalBedSpace(0);
    }
  }, [createNewRoomResult.error, createNewRoomResult.data]);

  useEffect(() => {
    const hostelId =
      props.location && props.location.state && props.location.state.hallId;
    if (!hostelId) {
      return props.history.push("/view_created_hostels");
    }
    const { hallId, hallName, location, roomType } =
      props.location && props.location.state && props.location.state;
    setHostelName(hallName);
    setHostelId(hallId);
    setLocation(location);
    setroomType(roomType);
  }, []);

  const handleRoomCreation = async (e) => {
    e.preventDefault();
    //gather all values here
    if (!roomNumber) {
      alert("please enter the room number for the hostel");
      return;
    }
    if (!totalBedSpace) {
      alert("please enter the total bed space in the hostel");
      return;
    }

    const confirmData = window.confirm(`
                            hostel name :${hostelName} \n
                            location: ${location} \n
                            room type: ${roomType} \n
                            bed type: ${
                              singleBed ? "single beds" : "double beds"
                            }
    
    `);

    if (!confirmData) return;
    setsubmitted(!submitted);

    try {
      await createNewRoomMutation({
        variables: {
          input: {
            roomNumber,
            totalBedSpace,
            hallName: hostelName,
            hallId: hostelId,
            location,
            roomType,
            singleBed,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "roomNumber":
        setroomNumber(value);
        break;
      case "totalBedSpace":
        settotalBedSpace(value);
        break;
    }
  };

  return (
    <RoomStyles>
      <div className="row">
        <div className="col-md-12">
          {hostelName && hostelId && (
            <React.Fragment>
              <ErrorDisplay errors={errors} />
              <p className="text-center">
                Add room to {CapFirstLetterOfEachWord(hostelName)} hostel
              </p>

              <div className="float-right">
                <button
                  className="btn btn-success btn-sm mb-3"
                  onClick={() => props.history.push("/view_created_hostels")}
                >
                  go back to hostels
                </button>
              </div>

              <form onSubmit={handleRoomCreation}>
                <div className="form-group">
                  <label htmlFor="levelSelect">Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    className="form-control"
                    value={roomNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="levelSelect">Total bed space</label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalBedSpace"
                    value={totalBedSpace}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value={singleBed}
                    onChange={() => setSingleBed((prevValue) => !prevValue)}
                  />
                  <label className="form-check-label">
                    Check the box if the room consist of single beds
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="btn btn-info"
                >
                  {submitted ? "creating room please wait" : "create room"}
                </button>
              </form>
            </React.Fragment>
          )}
        </div>
      </div>
    </RoomStyles>
  );
};

export default CreateRoomInHall;
