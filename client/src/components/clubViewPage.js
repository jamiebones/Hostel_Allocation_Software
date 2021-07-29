import React from "react";
import styled from "styled-components";

const ClubViewPageStyles = styled.div`
  p {
    font-size: 18px;
    font-family: "Josefin Sans", cursive;
  }

  span {
    color: #8d5656;
  }
  .row {
    margin-bottom: 30px;
  }
`;

const ClubViewPage = (props) => {
  return (
    <ClubViewPageStyles>
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a
                class="btn btn-primary"
                onClick={() => props.history.push("/club_details")}
              >
                Go to club page
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a href="#" class="btn btn-primary">
                Go to club page
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a href="#" class="btn btn-primary">
                Go to club page
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a href="#" class="btn btn-primary">
                Go to club page
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a href="#" class="btn btn-primary">
                Go to club page
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a href="#" class="btn btn-primary">
                Go to club page
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a href="#" class="btn btn-primary">
                Go to club page
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div class="card-body">
              <h5 class="card-title text-center">Fresh Club</h5>
              <span class="card-text">
                <b>Exco</b>
              </span>
              <p class="card-text">
                President: <span>Pokesemke Teremetiy</span>
              </p>
              <p class="card-text">
                Vice President: <span>Julius Cesear</span>
              </p>
              <p class="card-text">
                Membership Strength: <span>50</span>
              </p>
              <a href="#" class="btn btn-primary">
                Go to club page
              </a>
            </div>
          </div>
        </div>
      </div>
    </ClubViewPageStyles>
  );
};

export default ClubViewPage;
