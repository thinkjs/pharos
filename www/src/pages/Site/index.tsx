import * as React from 'react';
import Layout from '../../components/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import Metric from './Metric';
import { Select } from 'antd';
import { observer, inject } from 'mobx-react';
const Option = Select.Option;
@inject('siteStore') @observer
class Site extends React.Component<any, any> {

  componentDidMount() {
    const { siteStore } = this.props
    siteStore.getList();
  }

  render() {
    const { siteStore } = this.props
    const { currentProject, list, changeSelectValue } = siteStore
    return (
      <Layout {...this.props}>
        <div style={{ marginBottom: '20px' }}>
          <Select value={currentProject} onChange={changeSelectValue}>
            {list.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
          </Select>
        </div>
        <Switch>
          <Redirect exact from="/site" to="/site/metric" />
          <Route path="/site/metric" component={Metric} />
        </Switch>
      </Layout>
    )
  }
}


export default Site