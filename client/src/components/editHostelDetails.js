import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GetHostelsByName } from "../graphql/queries";
import Loading from "./common/loading";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const EditHostelStyles = styled.div`
  .beds {
    color: green;
  }
`;

const EditHostelDetails = () => {
  const [hostelName, setHostelName] = useState("");
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [noData, setNoData] = useState(null);

  const history = useHistory();

  const [hostelFunctions, hostelResults] = useLazyQuery(GetHostelsByName, {
    variables: {
      hostelName: hostelName,
    },
  });

  useEffect(() => {
    if (hostelResults.loading) {
      setLoading(true);
    }
    if (hostelResults.error) {
      setErrors(hostelResults.error);
      setLoading(false);
    }
    if (hostelResults.data) {
      const hostelData = hostelResults.data.hostelDetailsByName;
      if (hostelData.length == 0) {
        setNoData(true);
        setHostels([]);
      } else {
        setHostels(hostelData);
        setNoData(null);
      }
      setLoading(false);
    }
  }, [hostelResults.error, hostelResults.data, hostelResults.loading]);

  const handleHostelNameChange = (e) => {
    const value = e.target.value;
    setHostelName(value);
    hostelFunctions(value);
  };
  return (
    <EditHostelStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-info text-center">Get Hostel Details</h3>
          {errors && (
            <p className="text-center lead text-danger">{errors.message}</p>
          )}
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={hostelName}
              onChange={handleHostelNameChange}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <hr />

          <div className="text-center">{loading && <Loading />}</div>

          {noData && (
            <p className="text-center lead">
              your search did not produce any result
            </p>
          )}

          {hostels.length > 0 ? (
            <div>
              {/* /we loop here */}

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Hall Name</th>
                    <th scope="col">Hall Type / Location</th>
                    <th scope="col">Hostel Fees</th>
                    <th scope="col">Rooms</th>
                    <th scope="col">Occupied By</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hostels.map(
                    ({
                      id,
                      hallName,
                      type,
                      location,
                      hostelFee,
                      rooms,

                      status,
                      occupiedBy,
                    }) => {
                      return (
                        <tr key={id}>
                          <td>
                            <p>{hallName.toUpperCase()}</p>
                          </td>
                          <td>
                            <p>
                              {type.toUpperCase()} HOSTEL{" "}
                              {location.toUpperCase()}
                            </p>
                          </td>

                          <td>
                            <p>{hostelFee}</p>
                          </td>

                          <td>
                            {rooms.map(
                              ({
                                roomNumber,
                                totalBedSpace,

                                hallId,
                              }) => {
                                return (
                                  <p key={roomNumber}>
                                    <span>{roomNumber}</span> &nbsp;
                                    <span className="beds">
                                      {totalBedSpace} beds
                                    </span>
                                  </p>
                                );
                              }
                            )}
                          </td>

                          <td>
                            {status == "special" ? (
                              occupiedBy &&
                              occupiedBy.map(
                                ({ facultyName, levels }, index) => {
                                  return (
                                    <p key={`${index}${facultyName}`}>
                                      {facultyName}
                                      <br />
                                      {levels.map((level, index) => {
                                        return (
                                          <React.Fragment
                                            key={`${index}${level}`}
                                          >
                                            <span>{level} &nbsp;</span>
                                          </React.Fragment>
                                        );
                                      })}
                                    </p>
                                  );
                                }
                              )
                            ) : (
                              <p>All Faculties</p>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-warning"
                              onClick={() =>
                                history.push(`/create_hostel`, {
                                  hallId: id,
                                })
                              }
                            >
                              Edit Hostel Details
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </EditHostelStyles>
  );
};

export default EditHostelDetails;
