import React from "react";
import { FaAward } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { FaIndustry } from "react-icons/fa";
import styled from "styled-components";

const ClubDetailsPageStyles = styled.div`
  .top-row {
    border: 2px solid #b8a2a2;
    height: 100px;
    border-left: 10px solid #308ee1;
  }
  .clubName {
    font-size: 40px;
    font-family: "Josefin Sans", cursive;
    color: #1e5a74;
  }
  .column {
    padding-top: 20px;
  }
  .mission-container {
    border: 2px solid #b8a2a2;
    margin: 20px 0px;
    border-left: 10px solid #308ee1;
    padding-top: 15px;

    height: auto;
  }
  @media (max-width: 600px) {
    .clubName {
      font-size: 20px;
    }
    .column {
      margin-top: -80px;
      padding-left: 24%;
    }
    .top-row {
      overflow: scroll;
    }
  }
  p {
    font-size: 18px;
    font-family: "Josefin Sans", cursive;
  }
  .icon {
    font-size: 30px;
  }
  .media{
    margin-top: 20px;
  }
`;

const ClubDetailsPage = () => {
  return (
    <ClubDetailsPageStyles>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="top-row">
            <div className="row">
              <div className="col-md-3">
                <img
                  src="https://via.placeholder.com/80"
                  className="img-thumbnail"
                />
              </div>

              <div className="col-md-9 column">
                <p className="clubName">Association of Ibom Students </p>
              </div>
            </div>
          </div>

          <div className="mission-container">
            <div className="row">
              <div className="col-md-3 offset-md-1">
                <p className="icon">
                  <FaAward size="6.5rem" color="#60b28e" />
                  <br />
                  Achievements
                </p>
                <p>
                  hello from space ghdhdhhd sjsjsj sjjsjsj sjjsjsj djjdjdjd
                  ddjdjd djdjjdj wgggw dhdhdjd whwhwhw dhhdhdh gdgdgdg dhhdhdh
                  hdhdhdh susususuus bsbsbsb sghshhshs ggdgdgdgd hhshshsh
                  ahhahah whwwuwuw djhddjjdjd hdhdhdh dghghdgdgdg hhdhdhhd
                  shhshsh mdmdmd dhhdhdhdh dudududdu dhhdhdhhd dhhdhdhdhb
                  dhhdhdhdhdh dhdhhdhdhdh
                </p>
              </div>
              <div className="col-md-3 offset-md-1">
                <p className="icon">
                  <FaIndustry size="6.5rem" color="#60b28e" />
                  <br />
                  Mission Statement
                </p>
                <p>
                  hello from space ghdhdhhd sjsjsj sjjsjsj sjjsjsj djjdjdjd
                  ddjdjd djdjjdj wgggw dhdhdjd whwhwhw dhhdhdh gdgdgdg dhhdhdh
                  hdhdhdh susususuus bsbsbsb sghshhshs ggdgdgdgd hhshshsh
                  ahhahah whwwuwuw djhddjjdjd hdhdhdh dghghdgdgdg hhdhdhhd
                  shhshsh mdmdmd dhhdhdhdh dudududdu dhhdhdhhd dhhdhdhdhb
                  dhhdhdhdhdh dhdhhdhdhdh
                </p>
              </div>
              <div className="col-md-3 offset-md-1">
                <p className="icon">
                  <FaBriefcase size="6.5rem" color="#60b28e" />
                  <br />
                  Vision Statement
                </p>
                <p>
                  hello from space ghdhdhhd sjsjsj sjjsjsj sjjsjsj djjdjdjd
                  ddjdjd djdjjdj wgggw dhdhdjd whwhwhw dhhdhdh gdgdgdg dhhdhdh
                  hdhdhdh susususuus bsbsbsb sghshhshs ggdgdgdgd hhshshsh
                  ahhahah whwwuwuw djhddjjdjd hdhdhdh dghghdgdgdg hhdhdhhd
                  shhshsh mdmdmd dhhdhdhdh dudududdu dhhdhdhhd dhhdhdhdhb
                  dhhdhdhdhdh dhdhhdhdhdh
                </p>
              </div>
            </div>
          </div>
          <div className="member-row">
            <div className="row">
              <div className="col-md-12">
                <h3 className="text-center">Membership</h3>
              </div>

              <div className="col-md-3 offset-md-1">
                <div class="media">
                  <img
                    className="align-self-start mr-3"
                    src="https://via.placeholder.com/120"
                    alt="Generic placeholder image"
                  />
                  <div className="media-body">
                    <h5 className="mt-0">President</h5>
                    <p>
                      Dept: <span>Economics</span>
                      <br />
                      Level: <span>200 level</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 offset-md-1">
                <div class="media">
                  <img
                    className="align-self-start mr-3"
                    src="https://via.placeholder.com/120"
                    alt="Generic placeholder image"
                  />
                  <div className="media-body">
                    <h5 className="mt-0">President</h5>
                    <p>
                      Dept: <span>Economics</span>
                      <br />
                      Level: <span>200 level</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 offset-md-1">
                <div class="media">
                  <img
                    className="align-self-start mr-3"
                    src="https://via.placeholder.com/120"
                    alt="Generic placeholder image"
                  />
                  <div className="media-body">
                    <h5 className="mt-0">President</h5>
                    <p>
                      Dept: <span>Economics</span>
                      <br />
                      Level: <span>200 level</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 offset-md-1">
                <div class="media">
                  <img
                    className="align-self-start mr-3"
                    src="https://via.placeholder.com/120"
                    alt="Generic placeholder image"
                  />
                  <div className="media-body">
                    <h5 className="mt-0">President</h5>
                    <p>
                      Dept: <span>Economics</span>
                      <br />
                      Level: <span>200 level</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 offset-md-1">
                <div class="media">
                  <img
                    className="align-self-start mr-3"
                    src="https://via.placeholder.com/120"
                    alt="Generic placeholder image"
                  />
                  <div className="media-body">
                    <h5 className="mt-0">President</h5>
                    <p>
                      Dept: <span>Economics</span>
                      <br />
                      Level: <span>200 level</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 offset-md-1">
                <div class="media">
                  <img
                    className="align-self-start mr-3"
                    src="https://via.placeholder.com/120"
                    alt="Generic placeholder image"
                  />
                  <div className="media-body">
                    <h5 className="mt-0">President</h5>
                    <p>
                      Dept: <span>Economics</span>
                      <br />
                      Level: <span>200 level</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 offset-md-1">
                <div class="media">
                  <img
                    className="align-self-start mr-3"
                    src="https://via.placeholder.com/120"
                    alt="Generic placeholder image"
                  />
                  <div className="media-body">
                    <h5 className="mt-1">President</h5>
                    <p>
                      Dept: <span>Economics</span>
                      <br />
                      Level: <span>200 level</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClubDetailsPageStyles>
  );
};

export default ClubDetailsPage;
