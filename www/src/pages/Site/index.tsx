import * as React from 'react';
import Layout from '../../components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import Metric from './Metric';
import PeoPle from '../People'



class Site extends React.Component<any, any> {

  render() {
    return (
      <Layout {...this.props}>
        <Switch>
          <Redirect exact from="/site" to="/site/metric" />
          <Route path="/site/metric" component={Metric} />
          <Route path="/site/users" component={PeoPle} />
        </Switch>
      </Layout>
    )
  }
}


export default Site