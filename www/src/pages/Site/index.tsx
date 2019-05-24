import * as React from 'react';
import Layout from '../../components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import Metric from './Metric';
class Site extends React.Component<any, any> {

  render() {
    return (
      <Layout {...this.props}>
        <Switch>
          <Redirect exact from="/site" to="/site/metric" />
          <Route path="/site/metric" component={Metric} />
        </Switch>
      </Layout>
    )
  }
}


export default Site