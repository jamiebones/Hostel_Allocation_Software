import React from "react";
import { Route, Redirect } from "react-router-dom";
import {Roles} from "../modules/utils";
const store = require("store");


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentUser = store.get("currentUser");
      
      if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return <Redirect to={{ pathname: "/login" }} />;
      }

      if (!currentUser || !currentUser.accessLevel) {
        // not logged in so redirect to login page with the return url
        return <Redirect to={{ pathname: "/login" }} />;
      }

      if (currentUser.accessLevel === "super-admin") {
        return <Component {...props} />;
      }

      // check if route is restricted by role
      if (Roles().indexOf(currentUser.accessLevel) === -1) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: "/" }} />;
      }

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);


export default PrivateRoute;