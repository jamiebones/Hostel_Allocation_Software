import React from "react";
import "react-tabs/style/react-tabs.css";
import styled from "styled-components";

const AdminDashboardStyles = styled.div`
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
  return (
    <AdminDashboardStyles>
      <div className="row">
        <div className="col-md-12">
          <p className="lead">Welcome Admin</p>
        </div>
      </div>
    </AdminDashboardStyles>
  );
};

export default AdminDashboard;
