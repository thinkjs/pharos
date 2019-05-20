import * as React from 'react';
import Layout from '../../components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import MonitorAdd from './Monitor/Add';

const Alarm = (props) => {
  return (
    <Layout {...props}>
      <Switch>
        <Redirect exact from="/site" to="/site/monitor/add" />
        <Route path="/site/monitor/add" component={MonitorAdd} />
      </Switch>
    </Layout>
  )
}

export default Alarm