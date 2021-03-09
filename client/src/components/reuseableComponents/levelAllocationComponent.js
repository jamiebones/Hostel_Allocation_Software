import React, { useState } from "react";

import styled from "styled-components";

const ComponentStyles = styled.div`
.faculty-container {
  display: flex;
  width: 45vw;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  

  .facultyName {
      width: 20%;
      flex: 2;
      

  }

  .form-control-range {
    display: inline-block;
    width: 45%;
    flex: 10;
}

`;

const LevelAllocationComponent = ({ level, onChange, value }) => {
  const [percent, setPercent] = useState(value ? value: 0);
  const handleChange = (e) => {
    const value = e.target.value;
    setPercent(+value);
    onChange({ level: level, value: value });
  };
  return (
    <ComponentStyles>
      <div className="faculty-container">
        <span className="lead facultyName">{level}</span>

        <input
          defaultValue={value ? value : 0}
          type="range"
          className="form-control-range rangeInput"
          name="faculty"
          onChange={handleChange}
        />

        <span className="value lead">{percent}</span>
      </div>
    </ComponentStyles>
  );
};

export default LevelAllocationComponent;
