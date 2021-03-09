/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import NotAuthorizedComponent from "./notAuthorizedComponent";
import store from "store";

const Authorized = (props) => {
  const {
    authenticated,
    authorizedRole,
    component: Component,
    path,
    exact,
    ...rest
  } = props;

  const currentUser = store.get("currentUser");
  let user;
  if (currentUser) {
    user = currentUser;
  } else {
    //redirect the person else where
    return <Redirect to="/login" />;
  }

  return (
    <Route
      {...rest}
      path={path}
      exact={exact}
      render={(props) => {
        if (authorizedRole && authorizedRole.length > 0) {
          //check if the user belongs to the authorized role
          const { accessLevel } = user;
          if (
            authorizedRole.indexOf(
              accessLevel && accessLevel.toLowerCase() != -1
            )
          ) {
            return (
              <Component
                {...props}
                currentUser={currentUser}
                authenticated={authenticated}
              />
            );
          } else {
            //the person is not authorized so direct them to the login page
            return (
              <NotAuthorizedComponent
                {...props}
                requestedPage={window.location.pathname}
              />
            );
          }
        } else {
          return (
            <NotAuthorizedComponent
              {...props}
              requestedPage={window.location.pathname}
            />
          );
        }
      }}
    />
  );
};

export default Authorized;
