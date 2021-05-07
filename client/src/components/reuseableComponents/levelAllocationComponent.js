import React, { useState } from "react";

import styled from "styled-components";

const ComponentStyles = styled.div`
  .faculty-container {
    display: flex;
    width: 40vw;
    justify-content: space-between;
    align-items: baseline;
    border: 1px solid #717488;
    padding: 5px;
    margin-bottom: 10px;
    .facultyName {
      flex-basis: 30%;
    }

    .form-control-range {
      display: inline-block;
      flex-basis: 70%;
    }
  }
`;

const LevelAllocationComponent = ({ level, onChange, value }) => {
  const [percent, setPercent] = useState(value ? value : 0);
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

        <span className="value lead">{percent}%</span>
      </div>
    </ComponentStyles>
  );
};

export default LevelAllocationComponent;
