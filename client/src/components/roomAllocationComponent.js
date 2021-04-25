import React from "react";
import { CapFirstLetterOfEachWord, ISAuthorizedToView } from "../modules/utils";

const AllocationComponent = ({ allocation, index, currentUser }) => {
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
      phoneNumber,
      nextofKin,
    },
    room: { location, roomType },
  } = allocation;

  return (
    <React.Fragment>
      <th scope="row">{index + 1}</th>
      <td>
        <table className="table table-borderless table-sm b">
          <thead></thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{CapFirstLetterOfEachWord(name)}</td>
              <td>Sex</td>
              <td>{CapFirstLetterOfEachWord(sex)}</td>
            </tr>

            <tr>
              <td>Session</td>
              <td>{session}</td>
              <td>Reg Number</td>
              <td>{regNumber.toUpperCase()}</td>
            </tr>

            <tr>
              <td>Dept</td>
              <td>{CapFirstLetterOfEachWord(dept)}</td>
              <td>Level</td>
              <td>{currentLevel}</td>
            </tr>

            <tr>
              <td>Faculty</td>
              <td>{CapFirstLetterOfEachWord(faculty)}</td>
              <td>Phone Number</td>
              <td>{phoneNumber}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td>
        <table className="table table-borderless table-sm">
          <thead></thead>
          <tbody>
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
          {ISAuthorizedToView(currentUser, ["super-admin"]) && (
            <div className="d-print-none">
              <p>{nextofKin.name}</p>
              <p>{nextofKin.phone}</p>
              <p>{nextofKin.address}</p>
            </div>
          )}
        </div>
      </td>
      <td>
        <div>
          <img
            className="img-fluid"
            src={`http://uniuyo.edu.ng/eportals/passports/${profileImage}`}
            style={{ width: 100 + "px", height: 100 + "px" }}
          />
          <br />
          {studentConfirmed && <span>photo confirmed</span>}
        </div>
      </td>
    </React.Fragment>
  );
};

export default AllocationComponent;
