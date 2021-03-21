import React, { useEffect, useState } from "react";
import {
  GetAllHallsWithRoomDetails,
  GetSMSCreditAvailable,
} from "../graphql/queries";
import { SendSMSToStudents } from "../graphql/mutation";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import styled from "styled-components";
import Loading from "./common/loading";

const SendMessageToStudentStyles = styled.div`
  .div-hostel-select {
    max-height: 900px;
    overflow-y: scroll;
  }
  .word-length {
    float: right;
    font-size: 17px;
  }

  .sms-text {
    height: 250px;
  }

  .room-total {
    float: right;
  }
  .room-div {
    width: 100px;
    height: 50px;
    text-align: center;
    margin: 10px;
    padding-top: 5px;
    background-color: green;
    color: #fff;
    display: inline-block;
    position: relative;
    cursor: pointer;
    .bedTotal {
      float: right;
      position: absolute;
      bottom: 0;
      right: 5px;
    }
    .selected {
      color: gray;
    }
  }
`;

const filterForDuplicate = (oldArray, newValue, key) => {
  const returnRemain = oldArray.filter((value) => value[key] != newValue[key]);
  return [...returnRemain, newValue];
};

const _groupByHostel = (arrayOfHostel = []) => {
  let hostelGroup = arrayOfHostel.reduce((r, a) => {
    r[a.hostel] = r[a.hostel] || [];
    r[a.hostel].push(a);
    return r;
  }, Object.create(null));
  return hostelGroup;
};

const buildArrayOfRoomId = (roomsArray) => {
  let arrayOfRoomId = [];
  roomsArray.map(({ id }) => {
    arrayOfRoomId.push(id);
  });
  return arrayOfRoomId;
};

const SendMessageToStudent = () => {
  const [hostels, setHostels] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [messageArray, setMessageArray] = useState([]);

  const [errors, setErrors] = useState(null);
  const [smsCredits, setSmsCredit] = useState(null);
  const [creditQueryLoading, setQueryLoading] = useState(false);
  const [groupObject, setGroupObject] = useState(null);
  const [totalWords, setTotalWords] = useState(0);
  const [sms, setSMS] = useState("");
  const [smsPage, setSMSPage] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const roomDetails = useQuery(GetAllHallsWithRoomDetails);
  const credit = useQuery(GetSMSCreditAvailable);
  const [sendSMSQuery, sendSMSResult] = useMutation(SendSMSToStudents);

  let total = 0;

  useEffect(() => {
    if (sendSMSResult.error) {
      setErrors(sendSMSResult.error);
      setSubmitted(false);
    }

    if (sendSMSResult.data) {
      const { status, totalMessage } = sendSMSResult.data.sendMessage;
      setSubmitted(false);
      setSMS("");
      setMessageArray([]);
      window.alert(
        `Message status: ${status}.Total message sent: ${totalMessage}`
      );
    }
  }, [sendSMSResult.data, sendSMSResult.error]);

  useEffect(() => {
    const result = _groupByHostel(messageArray);
    setGroupObject(result);
  }, [messageArray]);

  useEffect(() => {
    if (roomDetails.error) {
      setErrors(roomDetails.error);
    }
    if (roomDetails.data) {
      const hostelData = roomDetails.data.getAllHalls;
      setHostels(hostelData);
    }
  }, [roomDetails.data, roomDetails.error]);

  useEffect(() => {
    if (credit.loading) {
      setQueryLoading(true);
    }
    if (credit.data) {
      setSmsCredit(credit.data.checkCredit);
      setQueryLoading(false);
    }
    if (credit.error) {
      setQueryLoading(false);
      setErrors(credit.error);
    }
  }, [credit.data, credit.error]);

  const selectedHostelChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    if (value === "all_students") {
      //the message is for all the students in the hostel
      //loop through the hostels and get the total number of msg to send
      let hostelArray = [];
      hostels.map((hostel) => {
        let roomsArray = hostel.rooms;
        roomsArray.map((room) => {
          let hostelObject = {};
          hostelObject.hostel = hostel.hallName;
          hostelObject.totalBedSpace = room.totalBedSpace;
          hostelObject.roomNumber = room.roomNumber;
          hostelObject.id = room.id;
          hostelArray.push(hostelObject);
        });
      });

      setMessageArray(hostelArray);
    } else {
      //get the particular selected hostel
      const selectedHostel = hostels.find((hostel) => hostel.id === value);
      setSelectedHostel(selectedHostel);
    }
  };

  const handleRoomSelectionChange = ({ allRooms, ...rest }) => {
    if (!allRooms) {
      const { roomNumber, totalBedSpace, id } = rest;
      const obj = {
        roomNumber,
        totalBedSpace,
        id,
        hostel: selectedHostel.hallName,
      };
      setMessageArray((prev) => filterForDuplicate(prev, obj, "id"));
    }
    if (allRooms) {
      //we are selecting all the rooms of the selected hostel

      selectedHostel.rooms.map((room) => {
        const { roomNumber, totalBedSpace, id } = room;
        const obj = {
          roomNumber,
          totalBedSpace,
          id,
          hostel: selectedHostel.hallName,
        };
        setMessageArray((prev) => filterForDuplicate(prev, obj, "id"));
      });
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    const textLength = 9 + value.length;
    setSMS(value);
    setTotalWords(textLength);
    setSMSPage(Math.ceil(textLength / 160));
  };

  const submitSMS = async () => {
    if (sms == "") {
      window.alert("please enter the text message you want to send");
      return;
    }
    if (!messageArray) {
      window.alert("please select the receipents of the message");
      return;
    }
    //build an array of id from the message array;
    const roomIds = buildArrayOfRoomId(messageArray);
    setSubmitted(true);
    try {
      await sendSMSQuery({
        variables: {
          roomIds: { ids: roomIds },
          sms: sms,
        },
        refetchQueries: [{ query: GetSMSCreditAvailable }],
      });
    } catch (error) {}
  };

  return (
    <SendMessageToStudentStyles>
      <div className="row">
        <div className="col-md-6">
          <div className="text-center">
            <h3 className="text-info">Send SMS To Students</h3>
            {errors && <p className="text-danger lead">{errors.message}</p>}
          </div>
          <select
            className="form-control form-select form-select-lg mb-3"
            onChange={selectedHostelChange}
          >
            <option value="0">select hostel</option>
            {roomDetails.loading && <option>loading.....</option>}
            <option value="all_students">
              send message to everyone residing in the hostel
            </option>
            {hostels &&
              hostels.map(({ id, hallName }) => {
                return (
                  <option key={id} value={id}>
                    {hallName.toUpperCase()}
                  </option>
                );
              })}
          </select>

          {selectedHostel &&
            selectedHostel.rooms.map(({ roomNumber, totalBedSpace, id }) => {
              return (
                <div
                  className="room-div"
                  key={id}
                  onClick={() =>
                    handleRoomSelectionChange({
                      roomNumber,
                      totalBedSpace,
                      id,
                      allRooms: false,
                    })
                  }
                >
                  <p>
                    <span>{roomNumber}</span>{" "}
                    <span className="bedTotal">{totalBedSpace}</span>
                  </p>
                </div>
              );
            })}

          {selectedHostel && (
            <div
              className="room-div"
              onClick={() => handleRoomSelectionChange({ allRooms: true })}
            >
              <p>
                Select All
                <span className="bedTotal"></span>
              </p>
            </div>
          )}

          <div className="form-floating mt-4 mb-2">
            <textarea
              className="form-control sms-text"
              placeholder="type sms here"
              id="floatingTextarea2"
              onChange={handleTextChange}
            ></textarea>

            <label>
              <span>{smsPage} page(s)</span>
            </label>

            <label htmlFor="floatingTextarea2" className="word-length">
              <span className="word-length">{totalWords}</span>
            </label>
          </div>
        </div>

        <div className="col-md-4 offset-md-1">
          <div className="div-hostel-select">
            {creditQueryLoading && (
              <div className="text-center">
                <Loading />
              </div>
            )}
            {smsCredits && (
              <p className="lead">
                Available Credits: {smsCredits.sms_credits}
              </p>
            )}

            {groupObject &&
              Object.keys(groupObject).map((k) => {
                return (
                  <div className="hostel" key={k}>
                    <p className="text-center lead">{k.toUpperCase()}</p>
                    {groupObject[k].map(({ roomNumber, totalBedSpace, id }) => {
                      total += +totalBedSpace;
                      return (
                        <div className="room" key={id}>
                          <p>
                            <span>{roomNumber}</span>
                            <span className="room-total">{totalBedSpace}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

            {total > 0 && (
              <div className="text-center">
                <p className="lead text-primary">Total messages: {total}</p>
                <button
                  className="btn btn-danger"
                  onClick={submitSMS}
                  disabled={submitted}
                >
                  {submitted
                    ? "sending sms......."
                    : `Send SMS to ${total} people`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SendMessageToStudentStyles>
  );
};

export default SendMessageToStudent;
