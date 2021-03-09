import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetHostelByTypeAndLocation } from "../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import { FaSearch } from "react-icons/fa";

import styled from "styled-components";

const SelectHostelStyles = styled.div``;

const SelectHostelComponent = () => {
  const [halls, setHalls] = useState([]);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [hallType, setHallType] = useState("");
  const [hallLocation, setHallLocation] = useState("");
  const [search, setSearch] = useState(false);
  const [getHallQuery, getHallResult] = useLazyQuery(
    GetHostelByTypeAndLocation
  );

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "hallType":
        if (value !== "0") setHallType(value);
        break;
      case "hallLocation":
        if (!value !== "0") setHallLocation(value);
        break;
    }
  };

  useEffect(() => {
    if (getHallResult.error) {
      setErrors(ExtractError(getHallResult.error));
      setSubmitted(!submitted);
    }
    if (getHallResult.data) {
      setHalls(getHallResult.data.getHallByLocationAndType);
      setSubmitted(!submitted);
      setSearch(true);
    }
  }, [getHallResult.error, getHallResult.data]);

  const handleSearch = (e) => {
    e.preventDefault();
    try {
      setSubmitted(!submitted);
      setSearch(false);
      getHallQuery({
        variables: {
          hallType,
          location: hallLocation,
        },
      });
    } catch (error) {}
  };

  return (
    <SelectHostelStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {getHallResult.loading ? <Loading /> : null}
          <ErrorDisplay errors={errors} />
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <select
                name="hallType"
                className="custom-select"
                onChange={handleChange}
              >
                <option value="0">select hostel type</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <select
                name="hallLocation"
                className="custom-select"
                onChange={handleChange}
              >
                <option value="0">select hostel location</option>
                <option value="main Campus">Main Campus</option>
                <option value="town Campus">Town Campus</option>
                <option value="annex Campus">Annex Campus</option>
              </select>
            </div>

            <div className="float-right">
              <button
                type="submit"
                className="btn btn-info mb-3 btn-lg"
                disabled={submitted}
              >
                {submitted ? (
                  "searching........"
                ) : (
                  <FaSearch size="1.5em" color="white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          {halls.length === 0 && search && (
            <p className="lead text-center">no data</p>
          )}
          {halls.length > 0 && (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Hall/Hostel</th>
                  <th scope="col">Type</th>
                  <th scope="col">Location</th>
                  <th scope="col">Hostel Fees</th>
                  <th scope="col">Occupied By</th>
                  <th scope="col">Level of occupants</th>
                  <th scope="col">Rooms</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {halls.map(
                  (
                    {
                      id,
                      hallName,
                      type,
                      location,
                      hostelFee,
                      occupiedBy,
                      occupiedByLevel,
                      rooms,
                    },
                    i
                  ) => {
                    return (
                      <tr key={id}>
                        <th scope="row">{i + 1}</th>
                        <td>
                          <p>{CapFirstLetterOfEachWord(hallName)}</p>
                        </td>
                        <td>
                          {" "}
                          <p>{CapFirstLetterOfEachWord(type)}</p>
                        </td>
                        <td>
                          <p>{CapFirstLetterOfEachWord(location)}</p>
                        </td>
                        <td>
                          <p>{hostelFee}</p>
                        </td>
                        <td>
                          {occupiedBy ? (
                            <p>
                              {occupiedBy.map((ele, i) => {
                                return (
                                  <React.Fragment key={`${i}${ele}`}>
                                    <span>{CapFirstLetterOfEachWord(ele)}</span>
                                    <br />
                                  </React.Fragment>
                                );
                              })}
                            </p>
                          ) : (
                            <p>all faculties</p>
                          )}
                        </td>

                        <td>
                          {occupiedByLevel ? (
                            <p>
                              {occupiedByLevel.map((ele, i) => {
                                return (
                                  <React.Fragment key={`${i}${ele}`}>
                                    <span>{CapFirstLetterOfEachWord(ele)}</span>
                                    <br />
                                  </React.Fragment>
                                );
                              })}
                            </p>
                          ) : (
                            <p>all levels</p>
                          )}
                        </td>

                        <td>
                          {rooms ? (
                            <p>
                              {rooms.map(({ roomNumber, totalBedSpace }, i) => {
                                return (
                                  <React.Fragment
                                    key={`${i - roomNumber + totalBedSpace}`}
                                  >
                                    <span>
                                      {CapFirstLetterOfEachWord(roomNumber)} -{" "}
                                      {totalBedSpace}
                                    </span>
                                    <br />
                                  </React.Fragment>
                                );
                              })}
                            </p>
                          ) : (
                            <p>no room data entered </p>
                          )}
                        </td>

                        <td>
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            <Link
                              className="btn btn-primary stretched-link"
                              to={{
                                pathname: "/create_room",
                                state: {
                                  hallName,
                                  hallId: id,
                                  location,
                                  roomType: type,
                                },
                              }}
                            >
                              create room
                            </Link>

                            <Link
                            className="btn btn-success stretched-link"
                            to={{
                              pathname: "/view_rooms",
                              state: {
                                hallName,
                                hallId: id,
                                location,
                                roomType: type,
                                rooms
                              },
                            }}
                          >
                            view rooms
                          </Link>
                          
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SelectHostelStyles>
  );
};

export default SelectHostelComponent;
