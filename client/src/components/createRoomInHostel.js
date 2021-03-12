import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CreateRoom } from "../graphql/mutation";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";
import { GetHostelByTypeAndLocation } from "../graphql/queries";
import ErrorDisplay from "./common/errorDisplay";

import styled from "styled-components";

const RoomStyles = styled.div``;

const CreateRoomInHall = (props) => {
  const [hostelName, setHostelName] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setroomType] = useState("");
  const [singleBeds, setSingleBeds] = useState("");
  const [doubleBeds, setDoubleBeds] = useState("");
  const [errors, setErrors] = useState([]);
  const [totalBedSpace, settotalBedSpace] = useState("");
  const [roomNumber, setroomNumber] = useState("");
  const [submitted, setsubmitted] = useState(false);

  const [createNewRoomMutation, createNewRoomResult] = useMutation(CreateRoom);
  const [getHallQuery, getHallResult] = useLazyQuery(
    GetHostelByTypeAndLocation
  );

  useEffect(() => {
    if (createNewRoomResult.error) {
      setErrors(ExtractError(createNewRoomResult.error));
      setsubmitted(!submitted);
    }
    if (createNewRoomResult.data) {
      //we push to where we were coming from or we create
      //new roomin the same hostel
      window.alert("Room creation successful");

      setsubmitted(!submitted);
      setroomNumber("");
      settotalBedSpace("");
      setSingleBeds("");
      setDoubleBeds("");
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

    const totalBeds = +singleBeds + +doubleBeds * 2;

    if (+totalBeds != +totalBedSpace) {
      alert(
        "Please check the entered figures, the sum of the total single bed \n\
        with the total double beds do not match the total bed space in the room"
      );
      return;
    }

    const confirmData = window.confirm(`
                            hostel name :${hostelName} \n
                            location: ${location} \n
                            room type: ${roomType} \n
                            single beds: ${singleBeds ? singleBeds : 0} \n
                            double beds: ${doubleBeds ? doubleBeds : 0} \n
                          
    
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
            singleBeds,
            doubleBeds,
          },
        },
        refetchQueries: [
          {
            query: GetHostelByTypeAndLocation,
            variables: {
              hallType: roomType,
              location: location,
            },
          },
        ],
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
      case "singleBeds":
        setSingleBeds(value);
        break;
      case "doubleBeds":
        setDoubleBeds(value);
        break;
    }
  };

  return (
    <RoomStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {hostelName && hostelId && (
            <React.Fragment>
              <ErrorDisplay errors={errors} />
              <h3 className="text-center text-info">
                Add room to {CapFirstLetterOfEachWord(hostelName)} Hostel
              </h3>

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

                <div className="form-group">
                  <label htmlFor="singleBeds">Number of single beds</label>
                  <input
                    type="number"
                    className="form-control"
                    name="singleBeds"
                    value={singleBeds}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="doubleBeds">Number of double beds</label>
                  <input
                    type="number"
                    className="form-control"
                    name="doubleBeds"
                    value={doubleBeds}
                    onChange={handleChange}
                  />
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
