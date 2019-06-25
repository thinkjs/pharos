import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import HOC from '@components/HOC'
import { monitorRootStore } from './store'
import ErrorPicture from './Error/Picture'
import ErrorList from './Error/List'
import Custom from './Custom'
import Perf from './Perf'

const Monitor = () => {
  return (
    <Switch>
      <Redirect exact from="/monitor" to="/monitor/error" />
      <Redirect exact from="/monitor/error" to="/monitor/error/picture" />
      <Route path="/monitor/error/picture" component={ErrorPicture} />
      <Route path="/monitor/error/list" component={ErrorList} />
      <Route path="/monitor/custom" component={Custom} />
      <Route path="/monitor/perf" component={Perf} />
    </Switch>
  )
}



export default HOC(Monitor, monitorRootStore)

