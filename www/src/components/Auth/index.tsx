import * as React from "react";
import { Route, Redirect } from 'react-router-dom'

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('pharosUser') ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location }
            }}
          />
        )
    }
  />
);

export { AuthRoute }