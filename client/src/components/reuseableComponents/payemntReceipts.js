import React from "react";
import { CapFirstLetterOfEachWord } from "../../modules/utils";
import styled from "styled-components";
import uniuyologo from "../../images/uniuyologo.jpg";

import { FormatDate } from "../../modules/utils";

const PayemntStyles = styled.div`
  p span {
    padding: 10px;
  }
  p {
    font-weight: 300;
  }

  .lead {
    font-weight: 400;
  }

  .text-danger strong {
    color: #9f181c;
  }
  .receipt-main {
    background: #ffffff none repeat scroll 0 0;
    border-bottom: 12px solid #333333;
    border-top: 12px solid #9f181c;
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 40px 30px !important;
    position: relative;
    box-shadow: 0 1px 21px #acacac;
    color: #333333;
    font-family: open sans;
  }
  .receipt-main p {
    color: #333333;
    font-family: open sans;
    line-height: 1.42857;
  }
  .receipt-footer h1 {
    font-size: 15px;
    font-weight: 400 !important;
    margin: 0 !important;
  }
  .receipt-main::after {
    background: #414143 none repeat scroll 0 0;
    content: "";
    height: 5px;
    left: 0;
    position: absolute;
    right: 0;
    top: -13px;
  }
  .receipt-main thead {
    background: #414143 none repeat scroll 0 0;
  }
  .receipt-main thead th {
    color: #fff;
  }
  .receipt-right h5 {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 7px 0;
  }
  .receipt-right p {
    margin: 0px;
  }
  .receipt-right p i {
    text-align: center;
    width: 18px;
  }
  .receipt-main td {
    padding: 9px 20px !important;
  }
  .receipt-main th {
    padding: 13px 20px !important;
  }
  .receipt-main td {
    font-size: 13px;
    font-weight: initial !important;
  }
  .receipt-main td p:last-child {
    margin: 0;
    padding: 0;
  }
  .receipt-main td h2 {
    font-size: 20px;
    font-weight: 900;
    margin: 0;
    text-transform: uppercase;
  }
  .receipt-header-mid .receipt-left h1 {
    font-weight: 100;
    margin: 34px 0 0;
    text-align: right;
    text-transform: uppercase;
  }
  .receipt-header-mid {
    margin: 24px 0;
    overflow: hidden;
  }

  #container {
    background-color: #dcdcdc;
  }
`;

const PaymentReceipts = ({ transactionDetails }) => {
  const {
    amount,
    transactionId,
    payerName,
    regNumber,
    session,
    date,
    student: { email, dept, faculty, currentLevel },
    roomDetails: { roomNumber, hallName, bedSpace, location, roomType },
    rrr,
  } = transactionDetails;

  return (
    <PayemntStyles>
      <div className="row">
        <div
          className="receipt-main 
    col-xs-10 offset-xs-1 col-sm-10 offset-sm-1 col-md-6 
    offset-md-3"
        >
          <div className="receipt-header">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 float-left">
                <div className="receipt-left">
                  <img
                    className="img-fluid"
                    alt="uniuyo logo"
                    src={uniuyologo}
                    style={{ width: 121 + "px", borderRadius: 43 + "px" }}
                  />
                </div>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6">
                <div className="receipt-right float-right">
                  <h5>Student Affairs Division.</h5>
                  <p>
                    +234 0000-000-900 <i className="fa fa-phone"></i>
                  </p>
                  <p>
                    info@gmail.com <i className="fa fa-envelope-o"></i>
                  </p>
                  <p>
                    University of Uyo <i className="fa fa-location-arrow"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="receipt-header receipt-header-mid">
            <div className="row">
              <div className="col-xs-8 col-sm-8 col-md-8 text-left">
                <div className="receipt-right">
                  <h5>{CapFirstLetterOfEachWord(payerName)}</h5>
                  <p>
                    <b>Reg Number :</b> {regNumber.toUpperCase()}
                  </p>
                  <p>
                    <b>Dept :</b> {CapFirstLetterOfEachWord(dept)}
                  </p>
                  <p>
                    <b>Faculty :</b> {CapFirstLetterOfEachWord(faculty)}
                  </p>
                  <p>
                    <b>Level :</b> {CapFirstLetterOfEachWord(currentLevel)}
                  </p>
                  <p>
                    <b>Session :</b> {CapFirstLetterOfEachWord(session)}
                  </p>
                </div>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4">
                <div className="receipt-right float-right">
                  <h5>Transaction Details</h5>
                  <p>
                    <b>Transaction Id :</b> {transactionId}
                  </p>
                  <p>
                    <b>RRR :</b> {rrr}
                  </p>
                  <p>
                    <b>Date :</b> {date && FormatDate(date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <table className="table table-bordered">
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="col-md-4">Hostel</td>
                    <td className="col-md-8">
                      {CapFirstLetterOfEachWord(hallName)}
                    </td>
                  </tr>
                  <tr>
                    <td className="col-md-4">Hostel Type</td>
                    <td className="col-md-8">
                      {CapFirstLetterOfEachWord(roomType)}
                    </td>
                  </tr>
                  <tr>
                    <td className="col-md-4">Location</td>
                    <td className="col-md-8">
                      {CapFirstLetterOfEachWord(location)}
                    </td>
                  </tr>

                  <tr>
                    <td className="col-md-4">Room Number</td>
                    <td className="col-md-8">{roomNumber}</td>
                  </tr>

                  <tr>
                    <td className="col-md-4">Bed Number</td>
                    <td className="col-md-8">{bedSpace}</td>
                  </tr>

                  <tr>
                    <td className="text-right">
                      <p>
                        <strong> Amount Paid: </strong>
                      </p>
                    </td>
                    <td>
                      <p>
                        <strong>&#8358;{amount}</strong>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-right">
                      <h2>
                        <strong>Total: </strong>
                      </h2>
                    </td>
                    <td className="text-left text-danger">
                      <h2>
                        <strong>
                          <strong>&#8358;{amount}</strong>
                        </strong>
                      </h2>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PayemntStyles>
  );
};

export default PaymentReceipts;
