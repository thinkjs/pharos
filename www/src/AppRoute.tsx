import * as React from "react";
import { Route, Redirect, Switch } from 'react-router-dom'
import App from './App'
import LoginRoute from './pages/login'
import NoMatch from './NoMatch'
import AuthRoute from './AuthRoute'

class AppRoute extends React.Component {

  render() {
    return (
      <Switch>
        {/* <Redirect exact from="/" to="/app" /> */}
        <AuthRoute exact path="/" component={App} />
        <Route path="/login" component={LoginRoute} />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}

export default AppRoute
