import * as React from 'react';
// import Layout from '../../components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import Create from './Create'
import Embed from './Embed'


const Project = (props) => {
  return (
    <Switch {...props}>
      <Redirect exact from="/project" to="/project/create" />
      <Route path="/project/create" component={Create} />
      <Route path="/project/embed" component={Embed} />
    </Switch>
  )
}

export default Project