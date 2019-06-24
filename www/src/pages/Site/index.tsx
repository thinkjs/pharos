import * as React from 'react';
import Layout from '@components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import Metric from './Metric';
import People from './People';
import Strategy from './Strategy';
import Config from './Config'



class Site extends React.Component<any, any> {

  render() {
    return (
      <Layout {...this.props}>
        <Switch>
          <Redirect exact from="/site" to="/site/metric/add" />
          <Redirect exact from="/site/metric" to="/site/metric/add" />
          <Route path="/site/metric/add" component={Metric} />
          <Route path="/site/users" component={People} />
          <Route path="/site/strategy" component={Strategy} />
          <Route path="/site/config" component={Config} />
        </Switch>
      </Layout>
    )
  }
}


export default Site