import React, { useEffect } from "react";
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
import LoginComponentRoute from "./components/loginComponentRoute";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/common/errorFallback";
import { useRecoilState } from "recoil";

/**
 imports of page components starts here
 */
import Footer from "./components/footer";
import state from "./applicationState";
import AuthorizedComponent from "./components/authorized";
import GlobalStyle from "./globalStyles";

import Loadable from "react-loadable";
import Loader from "./components/common/loader";

//loadable content start here start of code splitting by route

const LoadableBedSpaceStatsTotal = Loadable({
  loader: () =>
    import("./components/bedstatsTotal" /*webpackChunkName: "bedspaceStats"*/),
  loading: Loader,
  delay: 300,
});

const LoadableAssignSpaceToStudent = Loadable({
  loader: () =>
    import(
      "./components/assignSpaceToStudent" /*webpackChunkName: "assignSpaceToStudent"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableMakeRemitaPaymentUsingRRR = Loadable({
  loader: () =>
    import(
      "./components/makeRemitaPaymentUsingRRR" /*webpackChunkName: "makeRemitaPaymentUsingRRR"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadablePrintPaymentReceipt = Loadable({
  loader: () =>
    import(
      "./components/viewPaymentReceipt" /*webpackChunkName: "viewPaymentReceipt"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableStudentTransaction = Loadable({
  loader: () =>
    import(
      "./components/viewTransactions" /*webpackChunkName: "viewTransactions"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableViewStudentsInRooms = Loadable({
  loader: () =>
    import(
      "./components/viewStudentsInRoom" /*webpackChunkName: "viewStudentsInRoom"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableAdminAllocateFreeBed = Loadable({
  loader: () =>
    import(
      "./components/adminAllocationEachSession" /*webpackChunkName: "adminAllocationEachSession"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableEditHostelDetails = Loadable({
  loader: () =>
    import(
      "./components/editHostelDetails" /*webpackChunkName: "editHostelDetails"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableSendMessageToStudent = Loadable({
  loader: () =>
    import(
      "./components/sendMessageToStudents" /*webpackChunkName: "sendMessageToStudents"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableAdminViewTransaction = Loadable({
  loader: () =>
    import(
      "./components/adminViewTransaction" /*webpackChunkName: "adminViewTransaction"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableCreateStaffUserAccountByAdmin = Loadable({
  loader: () =>
    import(
      "./components/adminCreateUserAccount" /*webpackChunkName: "adminCreateUserAccount"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableSearchUserAccount = Loadable({
  loader: () =>
    import(
      "./components/searchStudentAccount" /*webpackChunkName: "searchStudentAccount"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableHomePage = Loadable({
  loader: () => import("./components/home" /*webpackChunkName: "homepage"*/),
  loading: Loader,
  delay: 300,
});

const LoadableStudentAccountCreation = Loadable({
  loader: () =>
    import(
      "./components/studentAccountCreation" /*webpackChunkName: "studentAccountCreation"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableLogin = Loadable({
  loader: () => import("./components/login" /*webpackChunkName: "login"*/),
  loading: Loader,
  delay: 300,
});

const LoadableDashBoard = Loadable({
  loader: () =>
    import("./components/dashboard" /*webpackChunkName: "dashboard"*/),
  loading: Loader,
  delay: 300,
});

const LoadableConfirmTransaction = Loadable({
  loader: () =>
    import(
      "./components/confirmRemitaTransaction" /*webpackChunkName: "confirmTransaction"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadablePrintAllocation = Loadable({
  loader: () =>
    import(
      "./components/printAllocation" /*webpackChunkName: "printAllocation"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableAdminDashboard = Loadable({
  loader: () =>
    import(
      "./components/adminDashboard" /*webpackChunkName: "adminDashboard"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableConfirmPhoneCode = Loadable({
  loader: () =>
    import(
      "./components/confirmPhoneCode" /*webpackChunkName: "confirmPhoneCode"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadablePrintStudentHostelAllocationBySession = Loadable({
  loader: () =>
    import(
      "./components/printAllocationBySession" /*webpackChunkName: "printAllocation"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableConfirmHostelAccomodation = Loadable({
  loader: () =>
    import(
      "./components/confirmHostelAccomodation" /*webpackChunkName: "confirmHostelAccomodation"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableGenerateRemitaRRR = Loadable({
  loader: () =>
    import("./components/generateRRR" /*webpackChunkName: "generateRRR"*/),
  loading: Loader,
  delay: 300,
});

const LoadableCreateNewSession = Loadable({
  loader: () =>
    import(
      "./components/createNewSession" /*webpackChunkName: "createNewSession"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableUpdateSessionData = Loadable({
  loader: () =>
    import(
      "./components/updateSessionNew" /*webpackChunkName: "updateSessionNew"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableActiateDeactivateSession = Loadable({
  loader: () =>
    import(
      "./components/activateSession" /*webpackChunkName: "activateDeactivateSession"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableCreateNewHostel = Loadable({
  loader: () =>
    import("./components/addHostel" /*webpackChunkName: "addHostel"*/),
  loading: Loader,
  delay: 300,
});

const LoadableSelectHostelComponent = Loadable({
  loader: () =>
    import(
      "./components/selectHostelComponet" /*webpackChunkName: "selectHostelComponent"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableCreateRoomInHostel = Loadable({
  loader: () =>
    import(
      "./components/createRoomInHostel" /*webpackChunkName: "createRoomInHostel"*/
    ),
  loading: Loader,
  delay: 300,
});

const LoadableRoomBedSpaceOperation = Loadable({
  loader: () =>
    import("./components/roomOperation" /*webpackChunkName: "roomOperation"*/),
  loading: Loader,
  delay: 300,
});

const LoadableBedSpaceSettings = Loadable({
  loader: () =>
    import(
      "./components/bedSpaceSettings" /*webpackChunkName: "bedSpaceSettings"*/
    ),
  loading: Loader,
  delay: 300,
});

/*import of component ends here */

const store = require("store");

const AppStyles = styled.div`
  .mainComponent {
    margin-top: 50px;
  }
`;

const App = (props) => {
  const [token, setToken] = useRecoilState(state.authToken);
  const [authenticated, setAuthenticated] = useRecoilState(state.authState);
  const [currentUser, setCurrentUser] = useRecoilState(state.currentUserState);

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

            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="mainComponent">
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Switch>
                        <React.Fragment>
                          <React.Fragment>
                            <Route
                              exact
                              path="/"
                              render={(props) => (
                                <LoadableHomePage
                                  authenticated={authenticated}
                                  currentUser={currentUser}
                                  {...props}
                                />
                              )}
                            />

                            {/* student route starts here*/}
                            <AuthorizedComponent
                              component={LoadableConfirmTransaction}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["student"]}
                              exact
                              path="/confirm_transaction"
                            />
                            <AuthorizedComponent
                              path="/make_payment"
                              exact
                              component={LoadableGenerateRemitaRRR}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                              authorizedRole={["student"]}
                            />
                            <AuthorizedComponent
                              path="/hostel_payment"
                              component={LoadableMakeRemitaPaymentUsingRRR}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                              authorizedRole={["student"]}
                              exact
                            />
                            <AuthorizedComponent
                              path="/print_allocation_receipt"
                              exact
                              component={LoadablePrintAllocation}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              {...props}
                              authorizedRole={["student"]}
                            />
                            <AuthorizedComponent
                              path="/dashboard"
                              exact
                              component={LoadableDashBoard}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["student"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/confirm_code"
                              exact
                              component={LoadableConfirmPhoneCode}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["student"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/print_allocation_session"
                              exact
                              component={
                                LoadablePrintStudentHostelAllocationBySession
                              }
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["student"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/student_transactions"
                              exact
                              component={LoadableStudentTransaction}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["student"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/print_receipt/:rrr"
                              exact
                              component={LoadablePrintPaymentReceipt}
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
                            {/* <Route
                            exact
                            path="/login"
                            render={(props) =>
                              !authenticated ? (
                                <LoadableLogin {...props} />
                              ) : (
                                <Redirect to="/" />
                              )
                            }
                          /> */}

                            <LoginComponentRoute
                              path="/login"
                              exact
                              component={LoadableLogin}
                              authenticated={authenticated}
                              {...props}
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
                              component={LoadableStudentAccountCreation}
                            />
                            {/* Admin routes from here  */}

                            <AuthorizedComponent
                              path="/admin/student_account"
                              exact
                              component={LoadableSearchUserAccount}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin", "admin"]}
                              {...props}
                            />

                            <AuthorizedComponent
                              path="/admin/dashboard"
                              exact
                              component={LoadableAdminDashboard}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin", "admin"]}
                              {...props}
                            />

                            <AuthorizedComponent
                              path="/admin/view_transactions"
                              exact
                              component={LoadableAdminViewTransaction}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin", "admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/admin/create_staff_account"
                              exact
                              component={LoadableCreateStaffUserAccountByAdmin}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/admin/edit_hostel"
                              exact
                              component={LoadableEditHostelDetails}
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
                              component={LoadableConfirmHostelAccomodation}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/admin/send_message"
                              exact
                              component={LoadableSendMessageToStudent}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/create_new_session"
                              exact
                              component={LoadableCreateNewSession}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/update_session/:sessionId"
                              exact
                              component={LoadableUpdateSessionData}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/activate_session"
                              exact
                              component={LoadableActiateDeactivateSession}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/create_hostel"
                              exact
                              component={LoadableCreateNewHostel}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/view_created_hostels"
                              exact
                              component={LoadableSelectHostelComponent}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/create_room"
                              exact
                              component={LoadableCreateRoomInHostel}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/view_rooms"
                              exact
                              component={LoadableRoomBedSpaceOperation}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/bedspace_settings"
                              exact
                              component={LoadableBedSpaceSettings}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/bedspace_stats"
                              exact
                              component={LoadableBedSpaceStatsTotal}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/assign_space"
                              exact
                              component={LoadableAssignSpaceToStudent}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/view_students_in_rooms"
                              exact
                              component={LoadableViewStudentsInRooms}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            <AuthorizedComponent
                              path="/view_space_given_by_admin"
                              exact
                              component={LoadableAdminAllocateFreeBed}
                              authenticated={authenticated}
                              currentUser={currentUser}
                              authorizedRole={["super-admin"]}
                              {...props}
                            />
                            {/* Admin routes ends here  */}
                          </React.Fragment>
                        </React.Fragment>
                      </Switch>
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </AppStyles>
        </Layout>
      </Router>
    </ApolloProvider>
  );
};

export default App;
