import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LockAllBedSpace, OpenAllBedSpace } from "../graphql/mutation";
import { useMutation } from "@apollo/client";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";

const BedSpaceSettingsStyles = styled.div`
  .div-settings {
    padding: 20px;
    margin-top: 30%;
    border: 2px solid #c0c0c0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2c3a3c;
  }
  .div-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const BedSpaceSettings = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lockAllBedMutation, lockAllSpaceResult] = useMutation(LockAllBedSpace);
  const [openAllBedMutation, openAllBedResult] = useMutation(OpenAllBedSpace);

  useEffect(() => {
    if (lockAllSpaceResult.error) {
      setErrors(ExtractError(lockAllSpaceResult.errror));
      setLoading(false);
      setSubmitted(!submitted);
    }
    if (lockAllSpaceResult.data) {
      alert("all bed space locked successfully");
      setLoading(false);
      setSubmitted(!submitted);
    }
  }, [lockAllSpaceResult.error, lockAllSpaceResult.data]);

  useEffect(() => {
    if (openAllBedResult.error) {
      setErrors(ExtractError(openAllBedResult.errror));
      setLoading(false);
      setSubmitted(!submitted);
    }
    if (openAllBedResult.data) {
      alert("all bed space open successfully");
      setLoading(false);
      setSubmitted(!submitted);
    }
  }, [openAllBedResult.error, openAllBedResult.data]);

  const handleOpenBedSpace = async () => {
    try {
      const confirmMe = window.confirm(
        "Are you sure? You are about opening all bed space.This action is not reversible. Please confirm"
      );
      if (!confirmMe) return;
      setSubmitted(!submitted);
      await openAllBedMutation({
        variables: {},
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLockBedSpace = async () => {
    try {
      const confirmMe = window.confirm(
        "Are you sure? You are about locking all bed space.This action is not reversible. Please confirm"
      );
      if (!confirmMe) return;
      setSubmitted(!submitted);
      await lockAllBedMutation({
        variables: {},
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BedSpaceSettingsStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3 div-container">
          <ErrorDisplay errors={errors} />
          {loading && <Loading />}
          <div className="div-settings">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                disabled={submitted}
                onClick={handleOpenBedSpace}
                className="btn btn-primary btn-lg float-left"
              >
                open all bed space
                {submitted ? "opening all space...." : "open all bed space"}
              </button>

              <button
                disabled={submitted}
                onClick={handleLockBedSpace}
                className="btn btn-warning btn-lg float-right"
              >
                {submitted ? "locking all space...." : "lock all bed space"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </BedSpaceSettingsStyles>
  );
};

export default BedSpaceSettings;
