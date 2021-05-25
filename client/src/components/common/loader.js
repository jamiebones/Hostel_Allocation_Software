import React from "react";
import styled from "styled-components";

const LoadableStyles = styled.div`
  .loader-div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
  .lds-hourglass {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-hourglass:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: 32px solid #116147;
    border-color: #116147 transparent #116147 transparent;
    animation: lds-hourglass 1.2s infinite;
  }
  @keyframes lds-hourglass {
    0% {
      transform: rotate(0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    50% {
      transform: rotate(900deg);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    100% {
      transform: rotate(1800deg);
    }
  }
`;

export default () => {
  return (
    <LoadableStyles>
      <div className="row">
        <div className="col-md-12">
          <div className="loader-div">
            <div className="lds-hourglass"></div>
          </div>
        </div>
      </div>
    </LoadableStyles>
  );
};
