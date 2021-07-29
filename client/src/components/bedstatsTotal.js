import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import Loading from "./common/loading";
import ErrorDisplay from "./common/errorDisplay";
import { GetBedStatusTotal } from "../graphql/queries";
import { ExtractError, CapFirstLetterOfEachWord } from "../modules/utils";
import styled from "styled-components";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import BedSpaceComponentSimple from "./reuseableComponents/bedSpaceComponentSimple";

const BedStatsTotalStyles = styled.div`
  .bed-display {
    display: flex;
    flex-wrap: wrap;
  }
  .color {
    width: 30px;
    height: 30px;

    display: inline-block;
  }
  .locked {
    background-color: green;
  }
  .vacant {
    background-color: blue;
  }
  .occupied {
    background-color: #16bd98;
  }
  .onHold {
    background-color: #c0c0c0;
  }
  .value {
    text-align: center;
  }
  .div-wrapper {
    .lead {
      margin-bottom: 1px;
    }
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 200px;
    border: 1px solid gray;
    padding: 2px 3px;
    margin-bottom: 30px;
    background-color: beige;
  }
  .div-panel {
    display: flex;
    justify-content: space-between;
  }
  .div-lock {
    margin-bottom: 30px;
  }
  .accordion__button {
    font-size: 20px;
    font-weight: 300;
  }
  .select {
    margin-bottom: 20px;
    margin-top: 88px;
  }
  .text-dark {
    color: #000;
  }
`;

const BedStatsTotal = () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(false);
  const [bedStatsQuery, bedStatsResult] = useLazyQuery(GetBedStatusTotal);

  useEffect(() => {
    if (bedStatsResult.error) {
      setErrors(ExtractError(bedStatsResult.error));
      setLoading(!loading);
      setSearch(false);
    }

    if (bedStatsResult.data) {
      setData(bedStatsResult.data.getbedsByStatus);
      setLoading(!loading);
      setSearch(true);
    }
  }, [bedStatsResult.error, bedStatsResult.data]);

  const handleBedStatusChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;

    try {
      bedStatsQuery({
        variables: {
          status: value,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (bedStatsResult.loading) {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <BedStatsTotalStyles>
      
      <div className="row">
        <div className="col-md-5 offset-md-3">
          <ErrorDisplay errors={errors} />
          <select
            onChange={handleBedStatusChange}
            className="form-control select"
          >
            <option value="0">select bed status</option>
            <option value="vacant">vacant</option>
            <option value="locked">locked</option>
            <option value="onhold">on hold</option>
            <option value="occupied">occupied</option>
            <option value="all">all rooms</option>
          </select>
        </div>
        <div className="col-md-2">
          <div className="div-wrapper">
            <p className="text-center lead">
              <b>key</b>
            </p>
            <div className="div-panel">
              <div className="color vacant"></div>
              <p className="value">vacant</p>
            </div>

            <div className="div-panel">
              <div className="color locked"></div>
              <p className="value">locked</p>
            </div>

            <div className="div-panel">
              <div className="color occupied"></div>
              <p className="value">occupied</p>
            </div>
            <div className="div-panel">
              <div className="color onHold"></div>
              <p className="value">on hold</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {data.length > 0 ? (
            data.map(({ hallName, rooms }, index) => {
              return (
                <Accordion
                  allowZeroExpanded={true}
                  allowMultipleExpanded={true}
                  key={index + 65775}
                >
                  <AccordionItem>
                    <AccordionItemHeading>
                      <AccordionItemButton key={hallName}>
                        {CapFirstLetterOfEachWord(hallName)}
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      {rooms.map(({ room, beds }) => {
                        return (
                          <div className="div-room" key={room}>
                            <p className="lead text-center text-dark">
                              Room Number: {CapFirstLetterOfEachWord(room)}
                            </p>
                            <hr />
                            <div className="bed-display">
                              {beds.map((bed, index) => {
                                return (
                                  <BedSpaceComponentSimple
                                    bed={bed}
                                    key={index}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </AccordionItemPanel>
                  </AccordionItem>
                </Accordion>
              );
            })
          ) : (
            <div>
              {search && data.length == 0 && (
                <p className="text-center lead">No data</p>
              )}
            </div>
          )}
        </div>
      </div>
    </BedStatsTotalStyles>
  );
};

export default BedStatsTotal;
