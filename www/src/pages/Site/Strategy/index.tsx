import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table, Divider, Popconfirm, Button } from 'antd';
import StrateFormModal from './modal'


@inject('strategyStore') @observer
class Strategy extends React.Component<any, any> {

  state = {
    columns: [
      {
        title: '策略名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '监控次数',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '关系',
        dataIndex: 'expression',
        key: 'expression',
      },
      {
        title: '阈值',
        dataIndex: 'limit',
        key: 'limit',
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
          return (
            <span>
              <span onClick={() => this.handleEdit(text)}>编辑</span>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除吗"
                okText="Yes"
                cancelText="No"
                onConfirm={() => this.handleDelete(text)}
              >
                删除
              </Popconfirm>
            </span>
          )
        },
      }
    ]
  }
  handleEdit = (text) => {
    this.handleBtnClick()
    const { strategyStore } = this.props
    const { setDefaultVal } = strategyStore
    setDefaultVal(text)
  }
  handleDelete = (text) => {
    const { strategyStore } = this.props
    const { deleteItem } = strategyStore

    deleteItem(text.id)
  }
  componentDidMount() {
    this.props.strategyStore.getList()
  }

  handleBtnClick = () => {
    const { strategyStore } = this.props
    const { showModal } = strategyStore
    showModal()
  }
  createList = (arr) => arr.map(item => {
    let conditions = JSON.parse(item.conditions)
    return {
      ...item,
      ...conditions
    }
  })
  render() {
    const { columns } = this.state
    const { strategyStore } = this.props
    let list: any = this.createList(strategyStore.list)
    return (
      <div>
        <div style={{ height: '40px', marginBottom: '10px' }}>
          <Button type="primary" style={{ float: 'right' }} onClick={this.handleBtnClick}>添加监控策略</Button>
        </div>
        <Table
          bordered={true}
          dataSource={list}
          columns={columns}
          rowKey='id'
        />
        <StrateFormModal />
      </div>
    )
  }
}


export default Strategy