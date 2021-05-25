import React from "react";
import styled from "styled-components";
import { CapFirstLetterOfEachWord } from "../../modules/utils";

const UsersTableStyles = styled.div`
  .even {
    background-color: #bdba4b;
  }
`;

const UserTable = ({ users, activateUser, submitted }) => {
  const activateDeactivateUser = (userId) => {
    activateUser(userId);
  };
  return (
    <UsersTableStyles>
      <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col" className="text-center">
              Name
            </th>
            <th scope="col" className="text-center">
              Reg Number
            </th>
            <th scope="col" className="text-center">
              Email
            </th>

            <th scope="col" className="text-center">
              Account Status
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ email, name, regNumber, active, id }) => {
            return (
              <tr key={regNumber} className="even">
                <td>
                  <p>{CapFirstLetterOfEachWord(name)}</p>
                </td>
                <td>
                  <p>{regNumber.toUpperCase()}</p>
                </td>
                <td>
                  <p>
                    <span>{email}</span>
                  </p>
                </td>
                <td>
                  {active ? (
                    <button
                      disabled={submitted}
                      className="btn btn-sm btn-danger"
                      onClick={() => activateDeactivateUser(id)}
                    >
                      {submitted ? "please wait....." : "deactivate"}
                    </button>
                  ) : (
                    <button
                      disabled={submitted}
                      className="btn btn-sm btn-success"
                      onClick={() => activateDeactivateUser(id)}
                    >
                      {submitted ? "please wait....." : "activate"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </UsersTableStyles>
  );
};

export default UserTable;
