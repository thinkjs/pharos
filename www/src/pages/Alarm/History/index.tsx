import * as React from 'react'
import { observer, inject } from 'mobx-react';
import { Table } from 'antd';

@inject('alarmStore') @observer
class AlarmHistory extends React.Component<any, any>{

  state = {
    columns: [
      {
        title: '报警策略',
        dataIndex: 'display_name',
        key: 'display_name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '报警信息',
        dataIndex: 'message',
        key: 'message'
      },
      {
        title: '报警触发时间',
        dataIndex: 'create_time',
        key: 'create_time'
      },
      {
        title: '持续次数',
        dataIndex: 'times',
        key: 'times'
      }
    ]
  }
  componentDidMount() {
    const { alarmStore } = this.props
    const { alarmHistoryStore } = alarmStore
    const { getList } = alarmHistoryStore
    getList()
  }

  render() {
    const { alarmStore } = this.props
    const { alarmHistoryStore } = alarmStore
    const { alarmHistoryList } = alarmHistoryStore
    const { columns } = this.state
    return (
      <div>
        <Table
          dataSource={alarmHistoryList}
          columns={columns}
          rowKey='display_name' />
      </div>
    )
  }
}


export default AlarmHistory