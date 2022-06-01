import React, { useEffect, Suspense } from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Navigation from "./components/navbar";
import Layout from "./components/layout";
import LoginComponentRoute from "./components/loginComponentRoute";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/common/errorFallback";
import Footer from "./components/footer";
import AuthorizedComponent from "./components/authorized";
import GlobalStyle from "./globalStyles";
import { useAuth } from "./context/authContext";

import Loader from "./components/common/loader";

//loadable content start here start of code splitting by route

const LoadableBedSpaceStatsTotal = React.lazy(() =>
  import("./components/bedstatsTotal" /*webpackChunkName: "bedspaceStats"*/)
);

const LoadableAssignSpaceToStudent = React.lazy(() =>
  import(
    "./components/assignSpaceToStudent" /*webpackChunkName: "assignSpaceToStudent"*/
  )
);

const LoadableMakeRemitaPaymentUsingRRR = React.lazy(() =>
  import(
    "./components/makeRemitaPaymentUsingRRR" /*webpackChunkName: "makeRemitaPaymentUsingRRR"*/
  )
);

const LoadablePrintPaymentReceipt = React.lazy(() =>
  import(
    "./components/viewPaymentReceipt" /*webpackChunkName: "viewPaymentReceipt"*/
  )
);

const LoadableStudentTransaction = React.lazy(() =>
  import(
    "./components/viewTransactions" /*webpackChunkName: "viewTransactions"*/
  )
);

const LoadableViewStudentsInRooms = React.lazy(() =>
  import(
    "./components/viewStudentsInRoom" /*webpackChunkName: "viewStudentsInRoom"*/
  )
);

const LoadableAdminAllocateFreeBed = React.lazy(() =>
  import(
    "./components/adminAllocationEachSession" /*webpackChunkName: "adminAllocationEachSession"*/
  )
);

const LoadableEditHostelDetails = React.lazy(() =>
  import(
    "./components/editHostelDetails" /*webpackChunkName: "editHostelDetails"*/
  )
);

const LoadableSendMessageToStudent = React.lazy(() =>
  import(
    "./components/sendMessageToStudents" /*webpackChunkName: "sendMessageToStudents"*/
  )
);

const LoadableAdminViewTransaction = React.lazy(() =>
  import(
    "./components/adminViewTransaction" /*webpackChunkName: "adminViewTransaction"*/
  )
);

const LoadableCreateStaffUserAccountByAdmin = React.lazy(() =>
  import(
    "./components/adminCreateUserAccount" /*webpackChunkName: "adminCreateUserAccount"*/
  )
);

const LoadableSearchUserAccount = React.lazy(() =>
  import(
    "./components/searchStudentAccount" /*webpackChunkName: "searchStudentAccount"*/
  )
);

const LoadableHomePage = React.lazy(() =>
  import("./components/home" /*webpackChunkName: "homepage"*/)
);

const LoadableStudentAccountCreation = React.lazy(() =>
  import(
    "./components/studentAccountCreation" /*webpackChunkName: "studentAccountCreation"*/
  )
);

const LoadableLogin = React.lazy(() =>
  import("./components/login" /*webpackChunkName: "login"*/)
);

const LoadableDashBoard = React.lazy(() =>
  import("./components/dashboard" /*webpackChunkName: "dashboard"*/)
);

const LoadableConfirmTransaction = React.lazy(() =>
  import(
    "./components/confirmRemitaTransaction" /*webpackChunkName: "confirmTransaction"*/
  )
);

const LoadablePrintAllocation = React.lazy(() =>
  import("./components/printAllocation" /*webpackChunkName: "printAllocation"*/)
);

const LoadableAdminDashboard = React.lazy(() =>
  import("./components/adminDashboard" /*webpackChunkName: "adminDashboard"*/)
);

const LoadableConfirmPhoneCode = React.lazy(() =>
  import(
    "./components/confirmPhoneCode" /*webpackChunkName: "confirmPhoneCode"*/
  )
);

const LoadablePrintStudentHostelAllocationBySession = React.lazy(() =>
  import(
    "./components/printAllocationBySession" /*webpackChunkName: "printAllocation"*/
  )
);

const LoadableConfirmHostelAccomodation = React.lazy(() =>
  import(
    "./components/confirmHostelAccomodation" /*webpackChunkName: "confirmHostelAccomodation"*/
  )
);

const LoadableGenerateRemitaRRR = React.lazy(() =>
  import("./components/generateRRR" /*webpackChunkName: "generateRRR"*/)
);

const LoadableCreateNewSession = React.lazy(() =>
  import(
    "./components/createNewSession" /*webpackChunkName: "createNewSession"*/
  )
);

const LoadableUpdateSessionData = React.lazy(() =>
  import(
    "./components/updateSessionNew" /*webpackChunkName: "updateSessionNew"*/
  )
);

const LoadableActiateDeactivateSession = React.lazy(() =>
  import(
    "./components/activateSession" /*webpackChunkName: "activateDeactivateSession"*/
  )
);

const LoadableCreateNewHostel = React.lazy(() =>
  import("./components/addHostel" /*webpackChunkName: "addHostel"*/)
);

const LoadableSelectHostelComponent = React.lazy(() =>
  import(
    "./components/selectHostelComponet" /*webpackChunkName: "selectHostelComponent"*/
  )
);

const LoadableCreateRoomInHostel = React.lazy(() =>
  import(
    "./components/createRoomInHostel" /*webpackChunkName: "createRoomInHostel"*/
  )
);

const LoadableRoomBedSpaceOperation = React.lazy(() =>
  import("./components/roomOperation" /*webpackChunkName: "roomOperation"*/)
);

const LoadableBedSpaceSettings = React.lazy(() =>
  import(
    "./components/bedSpaceSettings" /*webpackChunkName: "bedSpaceSettings"*/
  )
);

const LoadableGetPhoneCodeForStudent = React.lazy(() =>
  import(
    "./components/getPhoneCodeForStudent" /*webpackChunkName: "bedSpaceSettings"*/
  )
);

/*import of component ends here */

const store = require("store");

const AppStyles = styled.div`
  .mainComponent {
    margin-top: 50px;
  }
`;

const App = (props) => {
  const { token, setToken, currentUser, setCurrentUser, isAuth, setAuthState } =
    useAuth();

  useEffect(() => {
    if (!currentUser) {
      //load the stuffs from the store if it exists
      const token = store.get("authToken");
      const user = store.get("currentUser");
      if (user) {
        setCurrentUser(user);
        setAuthState(true);
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
              authenticated={isAuth}
              currentUser={currentUser}
            />
            {/* <CustomNavbar /> */}

            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="mainComponent">
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Suspense fallback={<Loader />}>
                        <Switch>
                          <React.Fragment>
                            <React.Fragment>
                              <Route
                                exact
                                path="/"
                                render={(props) => (
                                  <LoadableHomePage
                                    authenticated={isAuth}
                                    currentUser={currentUser}
                                    {...props}
                                  />
                                )}
                              />

                              {/* student route starts here*/}
                              <AuthorizedComponent
                                component={LoadableConfirmTransaction}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["student"]}
                                exact
                                path="/confirm_transaction"
                              />
                              <AuthorizedComponent
                                path="/make_payment"
                                exact
                                component={LoadableGenerateRemitaRRR}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                {...props}
                                authorizedRole={["student"]}
                              />
                              <AuthorizedComponent
                                path="/hostel_payment"
                                component={LoadableMakeRemitaPaymentUsingRRR}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                {...props}
                                authorizedRole={["student"]}
                                exact
                              />
                              <AuthorizedComponent
                                path="/print_allocation_receipt"
                                exact
                                component={LoadablePrintAllocation}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                {...props}
                                authorizedRole={["student"]}
                              />
                              <AuthorizedComponent
                                path="/dashboard"
                                exact
                                component={LoadableDashBoard}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["student"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/confirm_code"
                                exact
                                component={LoadableConfirmPhoneCode}
                                authenticated={isAuth}
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
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["student"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/student_transactions"
                                exact
                                component={LoadableStudentTransaction}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["student"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/print_receipt/:rrr"
                                exact
                                component={LoadablePrintPaymentReceipt}
                                authenticated={isAuth}
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
                                authenticated={isAuth}
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
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin", "admin"]}
                                {...props}
                              />

                              <AuthorizedComponent
                                path="/admin/dashboard"
                                exact
                                component={LoadableAdminDashboard}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin", "admin"]}
                                {...props}
                              />

                              <AuthorizedComponent
                                path="/admin/view_transactions"
                                exact
                                component={LoadableAdminViewTransaction}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin", "admin"]}
                                {...props}
                              />

                              <AuthorizedComponent
                                path="/admin/get_phone_code"
                                exact
                                component={LoadableGetPhoneCodeForStudent}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin", "admin"]}
                                {...props}
                              />

                              <AuthorizedComponent
                                path="/admin/create_staff_account"
                                exact
                                component={
                                  LoadableCreateStaffUserAccountByAdmin
                                }
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/admin/edit_hostel"
                                exact
                                component={LoadableEditHostelDetails}
                                authenticated={isAuth}
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
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/admin/send_message"
                                exact
                                component={LoadableSendMessageToStudent}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/create_new_session"
                                exact
                                component={LoadableCreateNewSession}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/update_session/:sessionId"
                                exact
                                component={LoadableUpdateSessionData}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/activate_session"
                                exact
                                component={LoadableActiateDeactivateSession}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/create_hostel"
                                exact
                                component={LoadableCreateNewHostel}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/view_created_hostels"
                                exact
                                component={LoadableSelectHostelComponent}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/create_room"
                                exact
                                component={LoadableCreateRoomInHostel}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/view_rooms"
                                exact
                                component={LoadableRoomBedSpaceOperation}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/bedspace_settings"
                                exact
                                component={LoadableBedSpaceSettings}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/bedspace_stats"
                                exact
                                component={LoadableBedSpaceStatsTotal}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/assign_space"
                                exact
                                component={LoadableAssignSpaceToStudent}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/view_students_in_rooms"
                                exact
                                component={LoadableViewStudentsInRooms}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              <AuthorizedComponent
                                path="/view_space_given_by_admin"
                                exact
                                component={LoadableAdminAllocateFreeBed}
                                authenticated={isAuth}
                                currentUser={currentUser}
                                authorizedRole={["super-admin"]}
                                {...props}
                              />
                              {/* Admin routes ends here  */}
                            </React.Fragment>
                          </React.Fragment>
                        </Switch>
                      </Suspense>
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
