import React, { useState, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import { GetAdminDashboardStats } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import Loading from "./common/loading";

const AdminDashboardStyles = styled.div`
  .account {
    background-color: #30375a;
  }
  .hostel {
    background-color: #090f1f;
  }

  .vacant {
    background-color: #462e02;
  }

  .occupied {
    background-color: #104008;
  }

  .lock {
    background-color: #a52b2b;
  }

  .stats {
    display: inline-block;
    width: 400px;
    height: 150px;
    margin: 20px;
    padding: 10px;
    position: relative;
  }
  .label {
    font-size: 26px;
    color: #eadbf1;
  }

  .value {
    font-size: 30px;
    color: white;
    position: absolute;
    bottom: 2px;
    right: 5px;
  }

  @media print {
    .react-tabs__tab {
      display: none;
    }
    .react-tabs__tab-list {
      display: none;
    }
  }
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { error, data, loading } = useQuery(GetAdminDashboardStats);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (error) {
      setErrors(error);
    }

    if (data) {
      setStats(data.getAdminDashBoardStats);
      console.log(data.getAdminDashBoardStats);
    }
  }, [data, error]);

  return (
    <AdminDashboardStyles>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <h3>Welcome Admin</h3>
            {errors && <p className="lead text-danger">{errors.message}</p>}
            {loading && <Loading />}
          </div>

          {stats && (
            <React.Fragment>
              <div className="stats account">
                <p className="label">Student Account</p>

                <p className="value">{stats.studentAccounts}</p>
              </div>
              <div className="stats hostel">
                <p className="label">Hostels</p>

                <p className="value">{stats.hostelNumber}</p>
              </div>
              <div className="stats vacant">
                <p className="label">Vacant Beds</p>

                <p className="value">{stats.vacantBeds}</p>
              </div>

              <div className="stats lock">
                <p className="label">Locked Beds</p>

                <p className="value">{stats.lockedBeds}</p>
              </div>

              <div className="stats occupied">
                <p className="label">Occupied Beds</p>

                <p className="value">{stats.occupiedBeds}</p>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </AdminDashboardStyles>
  );
};

export default AdminDashboard;
