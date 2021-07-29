import React from "react";
import { FaLock, FaUnlock, FaUser } from "react-icons/fa";

import styled from "styled-components";

const BedSpaceStyles = styled.div`
  cursor: pointer;
  .bed-div {
    padding: 20px 20px;
  }
`;

const handleBedSpaceClick = ({ id, bedStatus, bedNumber, updateFunc }) => {
  let newStatus;
  if (bedStatus === "occupied") return;
  if (bedStatus === "locked") {
    newStatus = "vacant";
  }
  if (bedStatus === "vacant") {
    newStatus = "locked";
  }
  if (bedStatus === "onHold") {
    newStatus = "locked";
  }

  const confirmStatusChange = window.confirm(
    `you are about changing bed number ${bedNumber} from ${bedStatus} to ${newStatus}. Are you sure?`
  );
  if (!confirmStatusChange) return;
  updateFunc({ newStatus, id });
};

const BedSpaceComponent = ({ bed, updateFunc }) => {
  const { bedStatus, lockStart, bedNumber, id } = bed;
  return (
    <BedSpaceStyles
      onClick={() =>
        handleBedSpaceClick({ id, bedStatus, bedNumber, updateFunc })
      }
    >
      {bedStatus === "locked" && (
        <div className="bed-div">
          <FaLock size="60px" color="green" />
          <p className="text-center">{bedNumber}</p>
        </div>
      )}

      {bedStatus === "vacant" && (
        <div className="bed-div">
          <FaUnlock size="60px" color="blue" />
          <p className="text-center">{bedNumber}</p>
        </div>
      )}

      {bedStatus === "occupied" && (
        <div className="bed-div">
          <FaUser size="60px" color="#16bd98" />
          <p className="text-center">{bedNumber}</p>
        </div>
      )}

      {bedStatus === "onHold" && (
        <div className="bed-div">
          <FaUser size="60px" color="#c0c0c0" />
          <p className="text-center">{bedNumber}</p>
        </div>
      )}
    </BedSpaceStyles>
  );
};

export default BedSpaceComponent;
