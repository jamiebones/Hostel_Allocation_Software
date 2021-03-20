import React, { useState } from "react";
import styled from "styled-components";
import { CapFirstLetterOfEachWord } from "../modules/utils";

import uniuyologo from "../images/uniuyologo.jpg";

const PrintAllocationStyles = styled.div`
  .official-label {
    width: 100px;
    display: inline-block;
  }

  @media print {
    .container {
      width: auto;
    }
  }
  p {
    margin-bottom: 20px;

    padding: 10px;
  }

  .span_value {
    padding: 10px;
  }

  .div_details {
    border-radius: 20px;
  }

  .details_hostel {
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .div_student_info {
    height: 300px;
  }
  .div_bio_data {
    height: 300px;
  }

  .image {
    padding: 20px;
  }

  table tr > td:first-child {
    font-weight: bold;
  }
  .div-image {
    display: none;
    margin-bottom: 30px;
  }
  @page {
    size: auto;
  }
  @media print {
    .col-sm-1,
    .col-sm-2,
    .col-sm-3,
    .col-sm-4,
    .col-sm-5,
    .col-sm-6,
    .col-sm-7,
    .col-sm-8,
    .col-sm-9,
    .col-sm-10,
    .col-sm-11,
    .col-sm-12 {
      float: left;
    }
    .col-sm-12 {
      width: 100%;
    }
    .col-sm-11 {
      width: 91.66666667%;
    }
    .col-sm-10 {
      width: 83.33333333%;
    }
    .col-sm-9 {
      width: 75%;
    }
    .col-sm-8 {
      width: 66.66666667%;
    }
    .col-sm-7 {
      width: 58.33333333%;
    }
    .col-sm-6 {
      width: 50%;
    }
    .col-sm-5 {
      width: 41.66666667%;
    }
    .col-sm-4 {
      width: 33.33333333%;
    }
    .col-sm-3 {
      width: 25%;
    }
    .col-sm-2 {
      width: 16.66666667%;
    }
    .col-sm-1 {
      width: 8.33333333%;
    }
    .btn-row {
      display: none;
    }
    .details_hostel {
      margin-top: 80px;
    }
    .div-hostel {
      margin-top: 80px;
    }
    .div-image {
      display: block;
    }
  }
`;

const PrintAllocationComponent = ({ allocationData }) => {
  const [printDoc, setPrintDoc] = useState(false);
  const {
    hallName,
    roomNumber,
    bedSpace,
    session,
    student: {
      dept,
      faculty,
      email,
      sex,
      currentLevel,
      profileImage,
      regNumber,
      entryMode,
      name,
    },
    room: { location, roomType },
  } = allocationData;

  const printDocument = () => {
    if (printDoc) {
      window.print();
    }

    // const input = document.getElementById("printDiv");
    // html2canvas(input, {
    //   width: 2000,
    //   height: 1200,
    // }).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF();
    //   pdf.setFontSize(16);
    //   pdf.text(55, 20, "Hostel Accomodation Allocation Form");
    //   pdf.addImage(imgData, "PNG", 0, 30, 270, 260);
    //   pdf.save("allocation_slip.pdf");
    // });
  };

  return (
    <PrintAllocationStyles>
      <div className="text-center div-image">
        <img src={uniuyologo} style={{ width: 200 + "px" }} />
      </div>

      <div id="printDiv">
        <div className="row">
          <div className="col-sm-8 div_student_info">
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th scope="col" colSpan="2" className="text-center">
                    STUDENT INFORMATION
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Matric Num:</td>
                  <td>{regNumber.toUpperCase()}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>{CapFirstLetterOfEachWord(name)}</td>
                </tr>

                <tr>
                  <td>Faculty:</td>
                  <td>{CapFirstLetterOfEachWord(faculty)}</td>
                </tr>

                <tr>
                  <td>Department:</td>
                  <td>{CapFirstLetterOfEachWord(dept)}</td>
                </tr>

                <tr>
                  <td>Email:</td>
                  <td>{email}</td>
                </tr>

                <tr>
                  <td>Mode of Entry:</td>
                  <td>{CapFirstLetterOfEachWord(entryMode)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-sm-4">
            <div className="div_bio_data">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th scope="col" colSpan="2">
                      <img
                        className="img-fluid"
                        src={`http://uniuyo.edu.ng/eportals/passports/${profileImage}`}
                        style={{ width: 275 + "px", height: 200 + "px" }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Level:</td>
                    <td>{currentLevel}</td>
                  </tr>
                  <tr>
                    <td>Session:</td>
                    <td>{session}</td>
                  </tr>

                  <tr>
                    <td>Sex:</td>
                    <td>{CapFirstLetterOfEachWord(sex)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="div-hostel">
              <p className="text-center lead"><b>Hostel Details</b></p>

              <table className="table table-bordered table-sm">
                <thead></thead>
                <tbody>
                  <tr>
                    <td>Hostel:</td>
                    <td>{CapFirstLetterOfEachWord(hallName)}</td>
                  </tr>

                  <tr>
                    <td>Location:</td>
                    <td>{CapFirstLetterOfEachWord(location)}</td>
                  </tr>

                  <tr>
                    <td>Room Type:</td>
                    <td>{CapFirstLetterOfEachWord(roomType)}</td>
                  </tr>

                  <tr>
                    <td>Room:</td>
                    <td>{CapFirstLetterOfEachWord(roomNumber)}</td>
                  </tr>

                  <tr>
                    <td>Bed space:</td>
                    <td>{bedSpace}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border details_hostel">
              <p className="text-center lead"><b>Official</b></p>
              <div className="details">
                <p>
                  <span className="official-label">Verified By:</span>
                  <span className="span_value">
                    ___________________________
                  </span>

                  <span className="float-right">
                    Signature
                    <span className="span_value">
                      _________________________
                    </span>
                  </span>
                </p>

                <p>
                  <span className="official-label">Date</span>
                  <span className="span_value">_________________________</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row btn-row">
        <div className="col-md-5 offset-md-2">
          <button className="btn btn-info" onClick={() => window.print()}>
            print slip
          </button>
        </div>
      </div>
    </PrintAllocationStyles>
  );
};

export default PrintAllocationComponent;
