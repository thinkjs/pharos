import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Modal, Select, Table, Popconfirm } from 'antd';


const Option = Select.Option;

@inject('peopleStore') @observer
class People extends React.Component<any, any> {

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
        const { handleStatus } = peopleStore
        const { userStatus } = this.state
        return (
          <Select defaultValue={status} onChange={value => handleStatus(value, id)} disabled={userStatus}>
            <Option value={1}>管理员</Option>
            <Option value={0}>用户</Option>
          </Select>
        )
      }
    }, {
      title: '操作',
      key: 'action', render: (text) => {
        const { id } = text;
        const { peopleStore } = this.props
        const { handleDelete } = peopleStore
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
    userStatus: true
  }
  componentDidMount() {
    const { peopleStore } = this.props
    const { getListData, getPeopleList } = peopleStore
    getPeopleList()
    getListData()
    const userData: any = JSON.parse(localStorage.getItem('pharosUser') || '')
    this.setState({
      userStatus: userData.status ? false : true
    })
  }

  render() {
    const { peopleStore } = this.props
    const { columns, userStatus } = this.state
    const {
      sourceData,
      setModal,
      showModal,
      optionsData,
      handleSelected,
      hanldeClickOk,
      handleCancel
    } = peopleStore
    return (
      <div>
        <div>
          {
            userStatus ? null : <Button type="primary" style={{ float: 'right' }} onClick={() => { setModal(true) }}>新增</Button>
          }

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
      </div>
    )
  }
}

export default People