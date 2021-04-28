import React from "react";
import { Route, Redirect } from "react-router-dom";

const LoginComponentRoute = (props) => {
  const { authenticated, component: Component, path, exact, ...rest } = props;

  return (
    <Route
      {...rest}
      path={path}
      exact={exact}
      render={(props) => {
        if (authenticated) {
          return <Redirect to="/" />;
        } else {
          return (
            <Component authenticated={authenticated} {...rest} {...props} />
          );
        }

        // not logged in so redirect to login page with the return url
      }}
    />
  );
};

export default LoginComponentRoute;
