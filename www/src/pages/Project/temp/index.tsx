import * as React from 'react';
import Layout from '../../../components/Layout'
import { observer, inject } from 'mobx-react';
import {
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
} from "antd";

import AddModifyModal from './add-modify-modal'
import GetCodeModal from './get-code'

const { Search } = Input;

@inject('projectStore') @observer
class Project extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const { projectStore } = props
    this.state = {
      columns: [{
        title: '网站名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      },
      {
        title: '网站地址',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: '操作',
        key: 'action',
        render: (text) => {
          const { id, name, url, sid } = text;
          return (
            <span>
              <span onClick={() => { projectStore.setShowGetCodeModal(true, sid, url) }}>获取代码</span>
              <Divider type="vertical" />
              <span onClick={() => projectStore.handleEdit(id, name, url)}>编辑</span>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除吗"
                okText="Yes"
                cancelText="No"
                onConfirm={() => projectStore.handleDeleteClick(id)}
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
    const { projectStore } = this.props
    projectStore.getList()
  }

  render() {
    const { projectStore } = this.props
    const { list, handleSearch, setShowAddModifyModal, setCurrentModel } = projectStore
    return (
      <Layout {...this.props}>
        <div style={{ margin: 20 }}>
          <div>
            <Search
              placeholder="请输入用户名"
              onSearch={value => handleSearch(value)}
              style={{ width: 200 }}
            />
            <Button type="primary" style={{ float: 'right' }} onClick={() => { setShowAddModifyModal(true); setCurrentModel(null) }}>新增</Button>
          </div>
          <div style={{ marginTop: 30 }}>
            <Table
              columns={this.state.columns}
              dataSource={list}
              bordered={true}
              rowKey="id"
            />
          </div>
        </div>
        <AddModifyModal />
        <GetCodeModal />
      </Layout>
    )
  }
}

export default Project