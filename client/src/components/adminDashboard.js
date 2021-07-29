import React, { useState, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import { GetAdminDashboardStats, GetStatsByHall } from "../graphql/queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import { SortAndMergeAsObjectBedStats } from "../modules/utils";
import styled from "styled-components";
import Loading from "./common/loading";
import HallSpaceStatsComponent from "./reuseableComponents/hallSpaceStats";

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
  const [stats, setAdminStats] = useState(null);
  const { error, data, loading } = useQuery(GetAdminDashboardStats);
  const [errors, setErrors] = useState(null);
  const [hallStats, setStats] = useState([]);
  const [statsQuery, statsResult] = useLazyQuery(GetStatsByHall);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      setErrors(error.message);
    }

    if (data) {
      setAdminStats(data.getAdminDashBoardStats);
      setErrors(null);
    }
  }, [data, error]);

  useEffect(() => {
    setStatsLoading(true);
    statsQuery();
  }, []);

  useEffect(() => {
    if (statsResult.error) {
      setStatsLoading(false);
      setErrors(statsResult.error.message);
    }

    if (statsResult.data) {
      const statsData = statsResult.data.getStatsByHall;
      setStatsLoading(false);
      setStats(SortAndMergeAsObjectBedStats(statsData));
    }
  }, [statsResult.error, statsResult.data]);

  return (
    <AdminDashboardStyles>
      <div className="row">
        <div className="col-12">
          <div className="text-center">
            <h2>Welcome Admin</h2>
            {errors && <p className="lead text-danger">{errors.message}</p>}
            {loading && <Loading />}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-lg-6 col-sm-12">
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

        <div className="col-lg-6 col-lg-6 col-sm-12">
          <div className="text-center">{statsLoading && <Loading />}</div>

          {hallStats && hallStats.length > 1 && (
            <HallSpaceStatsComponent stats={hallStats} />
          )}
        </div>
      </div>
    </AdminDashboardStyles>
  );
};

export default AdminDashboard;
