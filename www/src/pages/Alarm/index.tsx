import * as React from 'react';
import Layout from '@components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
// import AlarmList from './List';
import AlarmHistory from './History'

const Alarm = (props) => {
  return (
    <Layout {...props}>
      <Switch>
        <Redirect exact from="/alarm" to="/alarm/history" />
        <Route path="/alarm/history" component={AlarmHistory} />
      </Switch>
    </Layout>
  )
}



export default Alarm

