import * as React from 'react';
import { observer, inject } from 'mobx-react';
import {
  Button,
  Table,
  Divider,
  Popconfirm,
} from "antd";

import AddModifyModal from './add-modify-modal'
import './index.less'

@inject('metricStore') @observer
class Project extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const { metricStore } = props
    this.state = {
      columns: [{
        title: '监控项英文名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '监控项中文名',
        dataIndex: 'display_name',
        key: 'display_name',
      },
      {
        title: '监控统计维度',
        dataIndex: 'factor',
        key: 'factor',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '操作',
        key: 'action',
        render: (text) => {
          const { id, name, url } = text;
          return (
            <span>
              <span onClick={() => metricStore.handleEdit(id, name, url)}>编辑</span>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除吗"
                okText="Yes"
                cancelText="No"
                onConfirm={() => metricStore.handleDeleteClick(id)}
              >
                删除
              </Popconfirm>
            </span>
          )
        },
      }],
    }
  }

  componentDidMount() {
    const { metricStore } = this.props
    metricStore.getList()
  }

  render() {
    const { metricStore } = this.props
    const { list, setShowAddModifyModal, setCurrentModel } = metricStore
    return (
      <div style={{ margin: 20 }}>
        <div style={{ height: '40px', marginBottom: '10px' }}>
          <Button type="primary" style={{ float: 'right' }} onClick={() => { setShowAddModifyModal(true); setCurrentModel(null) }}>添加监控项</Button>
        </div>
        <div style={{ marginTop: 30 }}>
          <Table
            columns={this.state.columns}
            dataSource={list}
            bordered={true}
            rowKey="id"
          />
        </div>
        <AddModifyModal />
      </div>
    )
  }
}

export default Project