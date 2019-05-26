import * as React from "react";
import { Route, Redirect, Switch } from 'react-router-dom'
import Signin from '../pages/Sign/Signin'
import Signup from '../pages/Sign/Signup'
import Perf from '../pages/Perf'
import Monitor from '../pages/Monitor'
import Alarm from '../pages/Alarm'
import Project from '../pages/Project'
import System from '../pages/System'
import Site from '../pages/Site'
import NoMatch from './NoMatch'
import People from '../pages/People'

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
  path: '/site',
  component: Site,
  type: 'auth'
}, {
  path: '/perf',
  component: Perf,
  type: 'auth'
}, {
  path: '/system',
  component: System,
  type: 'auth'
}, {
  path: '/people',
  component: People,
  type: 'auth'
}]

class App extends React.Component {

  render() {
    return (
      <Switch>
        {routes.map((route, index) => {
          if (route.type === 'auth') {
            return (<AuthRoute key={index} path={route.path} component={route.component} />)
          } else {
            return (
              <Route key={index} path={route.path} component={route.component} />
            )
          }
        })}
        <Redirect exact from="/" to="/project" />
        <Route component={NoMatch} />
      </Switch>
    );
  }
}

export default App
