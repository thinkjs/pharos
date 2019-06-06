import * as React from "react";
import { Route, Redirect, Switch } from 'react-router-dom'
import { AuthRoute } from '@components/Auth'
import Signin from '@pages/Sign/Signin'
import Signup from '@pages/Sign/Signup'
import Perf from '@pages/Perf'
import Monitor from '@pages/Monitor'
import Alarm from '@pages/Alarm'
import Project from '@pages/Project'
import System from '@pages/System'
import Site from '@pages/Site'
import NoMatch from '@components/NoMatch'
import '@components/style/index.less'

const routes = [{
  path: '/signin',
  component: Signin,
}, {
  path: '/signup',
  component: Signup,
}]

const authRoutes = [{
  path: '/monitor',
  component: Monitor,
}, {
  path: '/alarm',
  component: Alarm,
},
{
  path: '/project',
  component: Project,
},
{
  path: '/site',
  component: Site,
}, {
  path: '/perf',
  component: Perf,
}, {
  path: '/system',
  component: System,
}]

const App = () => (
  <Switch>
    {routes.map(r => <Route key={r.path} path={r.path} component={r.component} />)}
    {authRoutes.map(ar => <AuthRoute key={ar.path} path={ar.path} component={ar.component} />)}
    <Redirect exact from="/" to="/alarm" />
    <Route component={NoMatch} />
  </Switch>
)

export default App
