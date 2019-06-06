import * as React from 'react';
import Layout from '@components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import AlarmList from './List';

const Alarm = (props) => {
  return (
    <Layout {...props}>
      <Switch>
        <Redirect exact from="/alarm" to="/alarm/list" />
        <Route path="/alarm/list" component={AlarmList} />
      </Switch>
    </Layout>
  )
}

export default Alarm