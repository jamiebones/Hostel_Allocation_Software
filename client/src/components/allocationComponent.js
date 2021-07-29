import React from "react";
import { CapFirstLetterOfEachWord } from "../modules/utils";

const AllocationComponent = ({ allocation, confirmFunc, submitted }) => {
  const {
    hallName,
    roomNumber,
    bedSpace,
    session,
    studentConfirmed,
    student: {
      dept,
      faculty,
      email,
      sex,
      currentLevel,
      name,
      entryMode,
      profileImage,
      regNumber,
    },
    room: { location, roomType },
  } = allocation;

  const handleConfirmStudent = async () => {
    confirmFunc();
  };

  return (
    <React.Fragment>
      <th scope="row">1</th>
      <td>
        <table className="table table-borderless">
          <thead></thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{CapFirstLetterOfEachWord(name)}</td>
            </tr>
            <tr>
              <td>Sex</td>
              <td>{CapFirstLetterOfEachWord(sex)}</td>
            </tr>
            <tr>
              <td>Session</td>
              <td>{session}</td>
            </tr>
            <tr>
              <td>Reg Number</td>
              <td>{regNumber.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Dept</td>
              <td>{CapFirstLetterOfEachWord(dept)}</td>
            </tr>
            <tr>
              <td>Level</td>
              <td>{CapFirstLetterOfEachWord(currentLevel)}</td>
            </tr>
            <tr>
              <td>Faculty</td>
              <td>{CapFirstLetterOfEachWord(faculty)}</td>
            </tr>
            <tr>
              <td>Entry Mode</td>
              <td>{CapFirstLetterOfEachWord(entryMode)}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td>
        <table className="table table-borderless">
          <thead></thead>
          <tbody>
            <tr>
              <td>Hall/Hostel</td>
              <td>{CapFirstLetterOfEachWord(hallName)}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>{CapFirstLetterOfEachWord(location)}</td>
            </tr>
            <tr>
              <td>Room TYpe</td>
              <td>{CapFirstLetterOfEachWord(roomType)}</td>
            </tr>
            <tr>
              <td>Room Number</td>
              <td>{CapFirstLetterOfEachWord(roomNumber)}</td>
            </tr>
            <tr>
              <td>Bed</td>
              <td>{bedSpace}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td>
        <div>
          <img
            className="img-fluid"
            src={`http://uniuyo.edu.ng/eportals/passports/${profileImage}`}
            style={{ width: 275 + "px", height: 200 + "px" }}
          />
        </div>
      </td>
      <td>
        {studentConfirmed ? (
          <p>
            <b>student confirmed</b>
          </p>
        ) : (
          <button
            className="btn btn-secondary"
            disabled={submitted}
            onClick={() => handleConfirmStudent()}
          >
            {submitted ? "confirming......" : "confirm student"}
          </button>
        )}
      </td>
    </React.Fragment>
  );
};

export default AllocationComponent;
