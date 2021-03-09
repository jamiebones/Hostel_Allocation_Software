import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const activeClassName = "nav-item-active";

const StyledLink = styled(NavLink).attrs({ activeClassName })`
  &.${activeClassName} {
    color: #011517 !important;
  }
`;

const NavbarStyles = styled.div`
  .navbar-light {
    background-color: #d11d1e;
  }
 

  .navbar-brand {
    color: #06fadd;
    cursor: pointer;
  }

  .navbar-light .nav-link {
    color: #fff;
  }

  .navbar-right {
    align-self: flex-end;
  }

  .dropdown-menu {
    background-color: #0e4155;
    width: 300px;
    padding: 20px;
  }

  .dropdown-menu .nav-link {
    color: #fff !important;
  }
  .nav-item{
    color: pink !important;
  }
`;
const Navbar = ({ token, authenticated, logoutFunction, currentUser }) => {
  const logout = () => {
    logoutFunction();
  };
  return (
    <NavbarStyles>
      <div className="header-nav">
        <div>
          <div>
            <header>
              <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <a className="navbar-brand" href="#">
                  Hostel Allocation
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav mr-auto">
                    <React.Fragment>
                      <li className="nav-item">
                        <StyledLink exact to="/" className="nav-link">
                          Home
                        </StyledLink>
                      </li>

                      <li className="nav-item">
                        <StyledLink exact to="/clubs" className="nav-link">
                          Clubs
                        </StyledLink>
                      </li>

                      {authenticated && currentUser && currentUser.accessLevel && (
                        <React.Fragment>
                          <li className="nav-item">
                            <StyledLink
                              exact
                              to="/admin/dashboard"
                              className="nav-link"
                            >
                              Admin Dashboard
                            </StyledLink>
                          </li>

                          <li className="nav-item">
                            <StyledLink
                              exact
                              to="/admin/confirm_allocation"
                              className="nav-link"
                            >
                              Confirm Hostel Status
                            </StyledLink>
                          </li>

                          <li className="nav-item dropdown">
                            <a
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              href="#"
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Hostel Functionality
                            </a>
                            <div className="dropdown-menu">
                              <StyledLink
                                exact
                                to="/view_created_hostels"
                                className="nav-item nav-link"
                              >
                                Add/View Rooms
                              </StyledLink>

                              <StyledLink
                                exact
                                to="/create_hostel"
                                className="nav-link"
                              >
                                Create New hostel
                              </StyledLink>

                              <StyledLink
                                exact
                                to="/view_students_in_rooms"
                                className="nav-link"
                              >
                                View Students In Rooms
                              </StyledLink>

                              <StyledLink
                                exact
                                to="/view_space_given_by_admin"
                                className="nav-link"
                              >
                                View Space Given By Admin
                              </StyledLink>

                              <StyledLink
                                exact
                                to="/bedspace_stats"
                                className="nav-link"
                              >
                                Bed Space Stats
                              </StyledLink>
                            </div>
                          </li>

                          <li className="nav-item dropdown">
                            <a
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              href="#"
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Session Functionality
                            </a>

                            <div className="dropdown-menu">
                              <StyledLink
                                exact
                                to="/create_new_session"
                                className="nav-link"
                              >
                                Create New Session
                              </StyledLink>

                              <StyledLink
                                exact
                                to="/activate_session"
                                className="nav-link"
                              >
                                Activate Session
                              </StyledLink>
                            </div>
                          </li>

                          <li className="nav-item dropdown">
                            <a
                              className="nav-link dropdown-toggle"
                              data-toggle="dropdown"
                              href="#"
                              role="button"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Core Functionality
                            </a>
                            <div className="dropdown-menu">
                              <StyledLink
                                exact
                                to="/bedspace_settings"
                                className="nav-link"
                              >
                                Bed space settings
                              </StyledLink>

                              <StyledLink
                                exact
                                to="/assign_space"
                                className="nav-link"
                              >
                                Assign Bed Space
                              </StyledLink>
                            </div>
                          </li>

                          <StyledLink
                            exact
                            to="/"
                            onClick={logout}
                            className="nav-link navbar-right"
                          >
                            logout
                          </StyledLink>
                        </React.Fragment>
                      )}

                      {authenticated && !currentUser.accessLevel && (
                        <React.Fragment>
                          <li className="nav-item">
                            <StyledLink
                              exact
                              to="/dashboard"
                              className="nav-link"
                            >
                              Dashboard
                            </StyledLink>
                          </li>

                          <li className="nav-item">
                            <StyledLink
                              exact
                              to="/"
                              onClick={logout}
                              className="nav-link"
                            >
                              logout
                            </StyledLink>
                          </li>
                        </React.Fragment>
                      )}

                      {!authenticated && (
                        <React.Fragment>
                          <li className="nav-item">
                            <StyledLink className="nav-link" exact to="/login">
                              Login
                            </StyledLink>
                          </li>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  </ul>
                  
                </div>
              </nav>
            </header>
          </div>
        </div>
      </div>
    </NavbarStyles>
  );
};

export default Navbar;
