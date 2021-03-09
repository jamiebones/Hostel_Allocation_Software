import React from "react";
import { FaLock, FaUnlock, FaUser, FaStreetView } from "react-icons/fa";

import styled from "styled-components";

const BedSpaceStyles = styled.div`
  cursor: pointer;
  .bed-div {
    padding: 20px 20px;
  }
`;

const BedSpaceComponent = ({ bed }) => {
  const { bedStatus, bedNumber } = bed;
  return (
    <BedSpaceStyles>
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

      {bedStatus === "onhold" && (
        <div className="bed-div">
          <FaStreetView size="60px" color="#c0c0c0" />
          <p className="text-center">{bedNumber}</p>
        </div>
      )}
    </BedSpaceStyles>
  );
};

export default BedSpaceComponent;
