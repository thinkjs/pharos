import * as React from 'react';
import { observer, inject } from 'mobx-react';
import {
  Table,
  Select
} from "antd";

const { Option } = Select;

@inject('errorListStore') @observer
class List extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      columns: [{
        title: '报错信息',
        dataIndex: 'errmsg',
        key: 'errmsg',
      },
      {
        title: '报错次数',
        dataIndex: 'count',
        key: 'count',
      }]
    }
  }

  componentDidMount = async () => {
    const { errorListStore } = this.props
    await errorListStore.getErrorMetricList()
  }

  render() {
    const { errorListStore } = this.props
    const { metricList, currentMetricId, list } = errorListStore
    console.log(79, currentMetricId)
    console.log(88, metricList)
    if (!metricList.length) return null
    return (
      <div className="error-list-wrap">
        <div>
          <Select value={currentMetricId} style={{ width: 240, marginBottom: 30 }}>
            {metricList.map((ml, index) => <Option key={index} value={ml.id} >{ml.display_name}</Option>)}
          </Select>
        </div>
        <Table
          columns={this.state.columns}
          dataSource={list}
          bordered={true}
          rowKey="id"
        />
      </div>
    )
  }
}

export default List