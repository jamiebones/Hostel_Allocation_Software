import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./apolloClient";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";
import Navigation from "./components/navbar";
import Layout from "./components/layout";

import AuthContext from "./context/authContext";
import Authenticated from "./components/authenticated";

/**
 imports of page components starts here
 */
import HomePage from "./components/home";
import StudentAccountCreation from "./components/studentAccountCreation";
import Login from "./components/login";
import DashBoard from "./components/dashboard";
import ConfirmTransaction from "./components/confirmRemitaTransaction";
import PrintAllocation from "./components/printAllocation";

import AdminDashboard from "./components/adminDashboard";
import ConfirmPhoneCode from "./components/confirmPhoneCode";
import PrintStudentHostelAllocationBySession from "./components/printAllocationBySession";
//import CreateNewRoom from "./components/addNewRoom";
//import ConfirmHostelAllocation from "./components/confirmHostelAccomodation";
import ConfirmHostelAccomodation from "./components/confirmHostelAccomodation";
import Authorized from "./components/authorized";
import GenerateRemitaRRR from "./components/generateRRR";
import CreateNewSession from "./components/createNewSession";
import UpdateSessionData from "./components/updateSessionNew";
import ActiateDeactivateSession from "./components/activateSession";
import CreateNewHostel from "./components/addHostel";
import SelectHostelComponent from "./components/selectHostelComponet";
import CreateRoomInHostel from "./components/createRoomInHostel";
import RoomNBedSpaceOperation from "./components/roomOperation";
import BedSpaceSettings from "./components/bedSpaceSettings";
import BedSpaceStatsTotal from "./components/bedstatsTotal";
import AssignSpaceToStudent from "./components/assignSpaceToStudent";
import MakeRemitaPaymentUsingRRR from "./components/makeRemitaPaymentUsingRRR";
import PrintPaymentReceipt from "./components/viewPaymentReceipt";
import StudentTransaction from "./components/viewTransactions";
import ViewStudentsInRooms from "./components/viewStudentsInRoom";
import AdminAllocateFreeBed from "./components/adminAllocationEachSession";
import ClubViewPage from "./components/clubViewPage";
import ClubDetailsPage from "./components/clubDetailsPage";
import CustomNavbar from "./components/common/customNavbar";
/**
 imports of page components ends here
 */

const store = require("store");

const AppStyles = styled.div`
  .mainComponent {
    margin-top: 50px;
  }
`;

const App = (props) => {
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  //const [didMount, setDidMount] = useState(false);

  //let didMount = false;

  useEffect(() => {
    //check for a token value here by running a query
    const token = store.get("authToken");
    let user = store.get("currentUser");
    let isMounted = true;
    if (isMounted) {
      if (token) {
        setToken(token);
        setAuthenticated(true);
        setCurrentUser(user);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const loginFunction = ({ id, token, email, regNumber, accessLevel }) => {
    //call the mutation here and verify if we are all
    if (token) {
      setToken(token);
      setAuthenticated(true);
      setCurrentUser({ id, email, regNumber, accessLevel });
    }
  };

  const logoutFunction = () => {
    //call the mutation here and verify if we are all

    setToken("");
    setAuthenticated(false);
    setCurrentUser(null);
    store.set("authToken", "");
    store.set("currentUser", {});
    client.clearStore();
  };

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          token: token,
          login: loginFunction,
          logout: logoutFunction,
          authenticated: authenticated,
        }}
      >
        <Router>
          <Layout>
            <AppStyles>
              <Navigation
                token={token}
                authenticated={authenticated}
                currentUser={currentUser}
                logoutFunction={logoutFunction}
              />
              {/* <CustomNavbar /> */}

              <Switch>
                <React.Fragment>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mainComponent">
                          <React.Fragment>
                            <Route
                              exact
                              path="/"
                              render={(props) => (
                                <HomePage
                                  authenticated={authenticated}
                                  currentUser={currentUser}
                                  {...props}
                                />
                              )}
                            />
                            <Route
                              exact
                              path="/clubs"
                              component={ClubViewPage}
                            />

                            <Route
                              exact
                              path="/club_details"
                              component={ClubDetailsPage}
                            />

                            {/* student route starts here*/}
                            <Authenticated
                              path="/confirm_transaction"
                              exact
                              component={ConfirmTransaction}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/make_payment"
                              exact
                              component={GenerateRemitaRRR}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/hostel_payment"
                              exact
                              component={MakeRemitaPaymentUsingRRR}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/print_allocation_receipt"
                              exact
                              component={PrintAllocation}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/dashboard"
                              exact
                              component={DashBoard}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/confirm_code"
                              exact
                              component={ConfirmPhoneCode}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/print_allocation_session"
                              exact
                              component={PrintStudentHostelAllocationBySession}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/student_transactions"
                              exact
                              component={StudentTransaction}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authenticated
                              path="/print_receipt/:rrr"
                              exact
                              component={PrintPaymentReceipt}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />

                            {/* students route ends here*/}

                            {/* <Route
                            exact
                            path="/confirm_transaction"
                            component={ConfirmTransaction}
                          /> */}
                            <Route
                              exact
                              path="/login"
                              render={(props) =>
                                !authenticated ? (
                                  <Login
                                    {...props}
                                    loginFunction={loginFunction}
                                  />
                                ) : (
                                  <Redirect to="/" />
                                )
                              }
                            />
                            {/* <Authenticated
                            
                            path="/dashboard"
                            exact
                            component={DashBoard}
                            authenticated={authenticated}
                          /> */}
                            <Route
                              exact
                              path="/create_account/"
                              component={StudentAccountCreation}
                            />
                            {/* Admin routes from here  */}
                            <Authorized
                              path="/admin/dashboard"
                              exact
                              component={AdminDashboard}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            {/* <Authorized
                              path="/admin/create_room"
                              exact
                              component={CreateNewRoom}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            /> */}
                            <Authorized
                              path="/admin/confirm_allocation"
                              exact
                              component={ConfirmHostelAccomodation}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/create_new_session"
                              exact
                              component={CreateNewSession}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/update_session/:sessionId"
                              exact
                              component={UpdateSessionData}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/activate_session"
                              exact
                              component={ActiateDeactivateSession}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/create_hostel"
                              exact
                              component={CreateNewHostel}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/view_created_hostels"
                              exact
                              component={SelectHostelComponent}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/create_room"
                              exact
                              component={CreateRoomInHostel}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/view_rooms"
                              exact
                              component={RoomNBedSpaceOperation}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/bedspace_settings"
                              exact
                              component={BedSpaceSettings}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/bedspace_stats"
                              exact
                              component={BedSpaceStatsTotal}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/assign_space"
                              exact
                              component={AssignSpaceToStudent}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/view_students_in_rooms"
                              exact
                              component={ViewStudentsInRooms}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />
                            <Authorized
                              path="/view_space_given_by_admin"
                              exact
                              component={AdminAllocateFreeBed}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                            />

                            {/* Admin routes ends here  */}
                          </React.Fragment>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              </Switch>
            </AppStyles>
          </Layout>
        </Router>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default App;
