import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import HOC from '@components/HOC'
import { alarmRootStore } from './store'
import AlarmList from './List';
import './store/chart'

const Alarm = () => {
  return (
    <Switch>
      <Redirect exact from="/alarm" to="/alarm/list" />
      <Route path="/alarm/list" component={AlarmList} />
    </Switch>
  )
}

console.log(87, alarmRootStore)
export default HOC(Alarm, alarmRootStore)

