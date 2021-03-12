import React, { useState, useEffect } from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/client";
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
import { useRecoilState } from "recoil";
import { createGlobalStyle } from "styled-components";

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
import AuthorizedComponent from "./components/authorized";
import Footer from "./components/footer";
import state from "./applicationState";
import EditHostelDetails from "./components/editHostelDetails";
import CustomNavbar from "./components/common/customNavbar";

import GlobalStyle from "./globalStyles";
/**
 imports of page components ends here
 */
import { useHistory } from "react-router-dom";

const store = require("store");

// const GlobalStyle = createGlobalStyle`
//     /* Your css reset here */
//
//   background-color: red;
// `;

const AppStyles = styled.div`
  .mainComponent {
    margin-top: 50px;
  }
`;

const App = (props) => {
  const [token, setToken] = useRecoilState(state.authToken);
  const [authenticated, setAuthenticated] = useRecoilState(state.authState);
  const [currentUser, setCurrentUser] = useRecoilState(state.currentUserState);

  console.log("i was rendered");
  useEffect(() => {
    if (!currentUser) {
      //load the stuffs from the store if it exists
      const token = store.get("authToken");
      const user = store.get("currentUser");
      if (user) {
        setCurrentUser(user);
        setAuthenticated(true);
        setToken(token);
      }
    }
  }, []);

  //let didMount = false;

  return (
    <ApolloProvider client={client}>
      <GlobalStyle />

      <Router>
        <Layout>
          <AppStyles>
            <Navigation
              token={token}
              authenticated={authenticated}
              currentUser={currentUser}
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

                          <AuthorizedComponent
                            component={ConfirmTransaction}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["student"]}
                            exact
                            path="/confirm_transaction"
                          />

                          {/* student route starts here*/}
                          <AuthorizedComponent
                            component={ConfirmTransaction}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["student"]}
                            exact
                            path="/confirm_transaction"
                          />

                          <AuthorizedComponent
                            path="/make_payment"
                            exact
                            component={GenerateRemitaRRR}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            {...props}
                            authorizedRole={["student"]}
                          />

                          <AuthorizedComponent
                            path="/hostel_payment"
                            component={MakeRemitaPaymentUsingRRR}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            {...props}
                            authorizedRole={["student"]}
                            exact
                          />

                          <AuthorizedComponent
                            path="/print_allocation_receipt"
                            exact
                            component={PrintAllocation}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            {...props}
                            authorizedRole={["student"]}
                          />
                          <AuthorizedComponent
                            path="/dashboard"
                            exact
                            component={DashBoard}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["student"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/confirm_code"
                            exact
                            component={ConfirmPhoneCode}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["student"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/print_allocation_session"
                            exact
                            component={PrintStudentHostelAllocationBySession}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["student"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/student_transactions"
                            exact
                            component={StudentTransaction}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["student"]}
                            {...props}
                          />

                          <AuthorizedComponent
                            path="/print_receipt/:rrr"
                            exact
                            component={PrintPaymentReceipt}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["student"]}
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
                                <Login {...props} />
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
                          <AuthorizedComponent
                            path="/admin/dashboard"
                            exact
                            component={AdminDashboard}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />

                          <AuthorizedComponent
                            path="/admin/edit_hostel"
                            exact
                            component={EditHostelDetails}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
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
                          <AuthorizedComponent
                            path="/admin/confirm_allocation"
                            exact
                            component={ConfirmHostelAccomodation}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/create_new_session"
                            exact
                            component={CreateNewSession}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/update_session/:sessionId"
                            exact
                            component={UpdateSessionData}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/activate_session"
                            exact
                            component={ActiateDeactivateSession}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/create_hostel"
                            exact
                            component={CreateNewHostel}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/view_created_hostels"
                            exact
                            component={SelectHostelComponent}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/create_room"
                            exact
                            component={CreateRoomInHostel}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/view_rooms"
                            exact
                            component={RoomNBedSpaceOperation}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/bedspace_settings"
                            exact
                            component={BedSpaceSettings}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/bedspace_stats"
                            exact
                            component={BedSpaceStatsTotal}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/assign_space"
                            exact
                            component={AssignSpaceToStudent}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/view_students_in_rooms"
                            exact
                            component={ViewStudentsInRooms}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
                            {...props}
                          />
                          <AuthorizedComponent
                            path="/view_space_given_by_admin"
                            exact
                            component={AdminAllocateFreeBed}
                            authenticated={authenticated}
                            currentUser={currentUser}
                            authorizedRole={["super-admin"]}
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
            <Footer />
          </AppStyles>
        </Layout>
      </Router>
    </ApolloProvider>
  );
};

export default App;
