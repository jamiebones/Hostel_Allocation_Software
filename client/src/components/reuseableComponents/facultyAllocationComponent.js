import React, { useState } from "react";

import styled from "styled-components";

const ComponentStyles = styled.div`
  .faculty-container {
    display: flex;
    width: 45vw;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    


    .facultyName {
        
        flex: 2;
        

    }

    .form-control-range {
      display: inline-block;
      flex: 8;
  }
  
`;

const FacultyAllocationComponent = ({ facultyName, facultyId, onChange, value }) => {
  const [percent, setPercent] = useState(value ? value: 0);
  const handleChange = (e) => {
    const value = e.target.value;
    setPercent(+value);
    onChange({ faculty: facultyName, value: value , facultyId});
  };
  return (
    <ComponentStyles>
      <div className="faculty-container">
        <span className="lead facultyName">{facultyName}</span>

        <input
          defaultValue={value ? value: 0}
          type="range"
          className="form-control-range rangeInput"
          name="faculty"
          onChange={handleChange}
        />

        <span className="value lead">{percent}%</span>
      </div>
    </ComponentStyles>
  );
};

export default FacultyAllocationComponent;
