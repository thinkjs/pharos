import * as React from 'react';
import Layout from '@components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import Users from './Users';

const System = (props) => {
  
  return (
    <Layout {...props}>
      <Switch>
        <Redirect exact from="/system" to="/system/users" />
        <Route path="/system/users" component={Users} />
      </Switch>
    </Layout>
  )
}

export default System