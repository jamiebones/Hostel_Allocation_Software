import React from "react";
import { FaLock, FaUnlock, FaUser, FaStreetView } from "react-icons/fa";

import styled from "styled-components";

const BedSpaceStyles = styled.div`
  cursor: pointer;
  .bed-div {
    padding: 20px 20px;
  }
`;

const LockedBedSpaceComponent = ({
  bed,
  handleBedSelect,
  location,
  room,
  roomType,
  hallName,
}) => {
  const { bedNumber } = bed;
  return (
    <BedSpaceStyles
      onClick={() =>
        handleBedSelect({ bed, location, room, roomType, hallName })
      }
    >
      <div className="bed-div">
        <FaLock size="60px" color="green" />
        <p className="text-center">{bedNumber}</p>
      </div>
    </BedSpaceStyles>
  );
};

export default LockedBedSpaceComponent;
