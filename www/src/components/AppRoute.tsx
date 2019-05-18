import * as React from "react";
import { Route, Redirect, Switch } from 'react-router-dom'
import Signin from '../pages/Sign/Signin'
import Signup from '../pages/Sign/Signup'
import Dashboard from '../pages/Dashboard'
import Monitor from '../pages/Monitor'
import Alarm from '../pages/Alarm'
import Project from '../pages/Project'
import User from '../pages/User'
import NoMatch from './NoMatch'

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('isLogin') ? (
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

const routes = [{
  path: '/signin',
  component: Signin,
  type: ''
}, {
  path: '/signup',
  component: Signup,
  type: ''
}, {
  path: '/dashboard',
  component: Dashboard,
  type: 'auth'
}, {
  path: '/monitor',
  component: Monitor,
  type: 'auth'
}, {
  path: '/alarm',
  component: Alarm,
  type: 'auth'
}, {
  path: '/project',
  component: Project,
  type: 'auth'
}, {
  path: '/user',
  component: User,
  type: 'auth'
}]

class App extends React.Component {

  render() {
    return (
      <Switch>
        {routes.map((route, index) => {
          if (route.type === 'auth') {
            return (<AuthRoute key={index} exact path={route.path} component={route.component} />)
          } else {
            return (
              <Route key={index} exact path={route.path} component={route.component} />
            )
          }
        })}
        <Redirect exact from="/" to="/dashboard" />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}

export default App
