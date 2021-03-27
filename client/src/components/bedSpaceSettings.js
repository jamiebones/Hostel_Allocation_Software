import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LockAllBedSpace, OpenAllBedSpace } from "../graphql/mutation";
import { useMutation } from "@apollo/client";
import Loading from "./common/loading";

const BedSpaceSettingsStyles = styled.div`
  .div-container {
    display: inline-flex;
    justify-content: center;
    align-items: space-between;
    width: 400px;
    height: 200px;
    background-color: #2b4404;
    padding: 20px;
    flex-direction: column;
    margin: 20px;
    p {
      font-size: 20px;
      color: #fff;
    }
  }
`;

const BedSpaceSettings = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lockAllBedMutation, lockAllSpaceResult] = useMutation(LockAllBedSpace);
  const [openAllBedMutation, openAllBedResult] = useMutation(OpenAllBedSpace);

  useEffect(() => {
    if (lockAllSpaceResult.error) {
      setErrors(lockAllSpaceResult.error);
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
      setErrors(openAllBedResult.error);
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
    } catch (error) {}
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
    } catch (error) {}
  };

  return (
    <BedSpaceSettingsStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-info text-center">Lock/Open All Bed Space</h3>
          <div className="text-center">
            {errors && <p className="lead text-danger">{errors.message}</p>}
            {loading && <Loading />}
          </div>

          <div className="div-container">
            <p>This button is used to open all bed space in the system</p>
            <button
              disabled={submitted}
              onClick={handleOpenBedSpace}
              className="btn btn-primary btn-lg"
            >
              {submitted ? "opening all space...." : "open all bed space"}
            </button>
          </div>

          <div className="div-container">
            <p>This button is used to lock all bed space in the system</p>
            <button
              disabled={submitted}
              onClick={handleLockBedSpace}
              className="btn btn-warning btn-lg"
            >
              {submitted ? "locking all space...." : "lock all bed space"}
            </button>
          </div>
        </div>
      </div>
    </BedSpaceSettingsStyles>
  );
};

export default BedSpaceSettings;
