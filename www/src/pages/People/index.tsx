import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Modal, Select, Table, Popconfirm } from 'antd';
import Layout from '../../components/Layout';


const Option = Select.Option;

@inject('peopleStore') @observer
class People extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }
  state = {
    columns: [{
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="javascript:;">{text}</a>,
    },
    {
      title: '昵称',
      dataIndex: 'display_name',
      key: 'nickname',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      key: 'status',
      render: (text) => {
        const { status, id } = text;
        const { peopleStore } = this.props
        const { handleStatus } = peopleStore.PeopleStore
        return (
          <Select defaultValue={status} onChange={value => handleStatus(value, id)}>
            <Option value={0}>管理员</Option>
            <Option value={1}>用户</Option>
          </Select>
        )
      }
    }, {
      title: '操作',
      key: 'action', render: (text) => {
        const { id } = text;
        const { peopleStore } = this.props
        const { handleDelete } = peopleStore.PeopleStore
        return (
          <span>
            <Popconfirm
              title="确认删除吗"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(id)}
            >
              删除
              </Popconfirm>
          </span>
        )
      },
    }],
  }
  componentDidMount() {
    const { peopleStore } = this.props
    const { getListData, getPeopleList } = peopleStore.PeopleStore
    getPeopleList()
    getListData()
  }

  render() {
    const { peopleStore } = this.props
    const { columns } = this.state
    const {
      sourceData,
      setModal,
      showModal,
      optionsData,
      handleSelected,
      hanldeClickOk,
      handleCancel
    } = peopleStore.PeopleStore
    return (
      <Layout {...this.props}>
        <div>
          <Button type="primary" style={{ float: 'right' }} onClick={() => { setModal(true) }}>新增</Button>
        </div>
        <div style={{ position: 'relative', top: 20 }}>
          <Table
            bordered={true}
            dataSource={sourceData}
            columns={columns}
            rowKey='id'
          />;
        </div>
        <Modal
          title="新增"
          visible={showModal}
          onOk={hanldeClickOk}
          onCancel={handleCancel}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请输入"
            onChange={handleSelected}
          >
            {
              optionsData.length && optionsData.map(item => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              })
            }
          </Select>
        </Modal>
      </Layout>
    )
  }
}

export default People