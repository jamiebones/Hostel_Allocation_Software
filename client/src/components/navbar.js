import React, { useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import state from "../applicationState";
import client from "../apolloClient";
import store from "store";

const activeClassName = "nav-item-active";

const StyledLink = styled(NavLink).attrs({ activeClassName })`
  &.${activeClassName} {
    color: #0ff17f !important;
  }
`;

const NavbarStyles = styled.div`
  .navbar-brand {
    color: #ffbd9d;
    cursor: pointer;
  }

  .navbar-light .nav-link {
    color: #fff;
  }

  .dropdown-menu {
    background-color: #0e4155;
    width: 250px;
    padding: 20px;
  }

  .dropdown-menu .nav-link {
    color: #fff !important;
  }
`;

const isAuthorizedToView = (currentUser, accessArray = []) => {
  if (!currentUser) {
    return false;
  }
  if (currentUser && currentUser.accessLevel) {
    const index = accessArray.indexOf(currentUser.accessLevel.toLowerCase());
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const Navbar = ({ authenticated, currentUser }) => {
  const [isAuth, setIsAuth] = useRecoilState(state.authState);
  const [user, setCurrentUser] = useRecoilState(state.currentUserState);
  const [token, setToken] = useRecoilState(state.authToken);

  let history = useHistory();

  useEffect(() => {}, [isAuth]);

  const handleLogOut = (e) => {
    e.preventDefault();
    setIsAuth(false);
    setCurrentUser({});
    setToken("");
    store.clearAll();
    client.clearStore();
    history.replace("/");
  };

  return (
    <NavbarStyles>
      <header>
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
          <a className="navbar-brand" href="#">
            Hostel Allocation
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav">
              {/*normal link start here */}
              <StyledLink exact to="/" className="nav-link">
                Home
              </StyledLink>
              {/*normal link end here */}

              {/*link for super admin start */}

              {authenticated &&
                isAuthorizedToView(currentUser, ["super-admin"]) && (
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
                        Manage Rooms
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
                          to="/view_students_in_rooms"
                          className="nav-link"
                        >
                          View Students In Rooms
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
                        Manage Hostels
                      </a>
                      <div className="dropdown-menu">
                        <StyledLink
                          exact
                          to="/create_hostel"
                          className="nav-link"
                        >
                          Create New hostel
                        </StyledLink>

                        <StyledLink
                          exact
                          to="/admin/edit_hostel"
                          className="nav-link"
                        >
                          Edit Hostel Details
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
                        Manage Session
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
                        Admin Utilities
                      </a>
                      <div className="dropdown-menu">
                        <StyledLink
                          exact
                          to="/bedspace_stats"
                          className="nav-link"
                        >
                          Bed Space Stats
                        </StyledLink>
                        <StyledLink
                          exact
                          to="/bedspace_settings"
                          className="nav-link"
                        >
                          Lock / Open Bed Space
                        </StyledLink>

                        <StyledLink
                          exact
                          to="/assign_space"
                          className="nav-link"
                        >
                          Assign Bed Space
                        </StyledLink>

                        <StyledLink
                          exact
                          to="/view_space_given_by_admin"
                          className="nav-link"
                        >
                          View Space Given By Admin
                        </StyledLink>

                        <StyledLink
                          className="nav-link"
                          exact
                          to="/admin/send_message"
                        >
                          Send SMS To Students
                        </StyledLink>
                      </div>
                    </li>

                    <li className="nav-item">
                      <StyledLink
                        className="nav-link"
                        exact
                        to="/admin/view_transactions"
                      >
                        Transactions
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
                        User Accounts
                      </a>

                      <div className="dropdown-menu">
                        <StyledLink
                          exact
                          to="/admin/create_staff_account"
                          className="nav-link"
                        >
                          Create Staff Account
                        </StyledLink>

                        <StyledLink
                          exact
                          to="/admin/student_account"
                          className="nav-link"
                        >
                          View Student Accounts
                        </StyledLink>
                      </div>
                    </li>
                  </React.Fragment>
                )}

              {/*link for super admin end */}

              {/*link for admin start */}

              {/*link for admin end */}

              {/*link for student start */}
              {isAuthorizedToView(currentUser, ["normal"]) && (
                <React.Fragment>
                  <li className="nav-item">
                    <StyledLink exact to="/dashboard" className="nav-link">
                      Dashboard
                    </StyledLink>
                  </li>
                </React.Fragment>
              )}
              {/*link for student end */}

              {/*link for supervisors start */}

              {/*link for supervisors end */}
            </ul>

            <ul className="navbar-nav ml-auto">
              {authenticated ? (
                <li className="nav-item">
                  <StyledLink
                    exact
                    to="/"
                    onClick={handleLogOut}
                    className="nav-link"
                  >
                    logout
                  </StyledLink>
                </li>
              ) : (
                <li className="nav-item">
                  <StyledLink className="nav-link" exact to="/login">
                    Login
                  </StyledLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </NavbarStyles>
  );
};

export default Navbar;
