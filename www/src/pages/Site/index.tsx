import * as React from 'react';
import Layout from '@components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import Metric from './Metric';
import People from './People'



class Site extends React.Component<any, any> {

  render() {
    return (
      <Layout {...this.props}>
        <Switch>
          <Redirect exact from="/site" to="/site/metric/add" />
          <Redirect exact from="/site/metric" to="/site/metric/add" />
          <Route path="/site/metric/add" component={Metric} />
          <Route path="/site/users" component={People} />
        </Switch>
      </Layout>
    )
  }
}


export default Site