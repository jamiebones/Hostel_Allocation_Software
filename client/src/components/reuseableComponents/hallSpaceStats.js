import React from "react";
import styled from "styled-components";

const HallSpaceStatsStyles = styled.div`
  .hostel-container {
    border: 1px solid green;
    padding: 20px;
    border-top: 10px solid rgb(54 74 65);
    margin-bottom: 10px;
    height: 100vh;
    overflow-y: scroll;
  }

  .hostel-card {
    background-color: #208072;
    padding: 10px;
    margin-bottom: 10px;
    height: 130px;
  }
  .stats-row {
    display: flex;
    justify-content: space-around;
  }
  .stats-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .hall-name {
    color: #fff;
  }
  .text-mute {
    background-color: #fff;
    color: black;
    border-radius: 20px;
    width: 30px;
    text-align: center;
  }
  .stats-text {
    font-size: 1.2rem;
    color: #f5f5f5;
  }
`;

const HallSpaceStats = ({ stats }) => {
  return (
    <HallSpaceStatsStyles>
      <div className="hostel-container">
     

        <h3 className="text-center">Available Hostel Spaces</h3>
        {stats.length &&
          stats.map(({ hall, locked, occupied, onhold, vacant }) => {
            return (
              <div className="hostel-card" key={hall}>
                <p className="hall-name text-center lead">
                  {hall.toUpperCase()}
                </p>

                <div className="stats-row">
                  <div className="stats-column">
                    <p className="stats-text">Occupied</p>

                    <p className="text-mute">{occupied ? occupied : "NA"}</p>
                  </div>

                  <div className="stats-column">
                    <p className="stats-text">Vacant</p>

                    <p className="text-mute">{vacant ? vacant : "NA"}</p>
                  </div>

                  <div className="stats-column">
                    <p className="stats-text">On Hold</p>

                    <p className="text-mute">{onhold ? onhold : "NA"}</p>
                  </div>

                  <div className="stats-column">
                    <p className="stats-text">Locked</p>

                    <p className="text-mute">{locked ? locked : "NA"}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </HallSpaceStatsStyles>
  );
};

export default HallSpaceStats;
