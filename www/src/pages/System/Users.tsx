import * as React from "react";
import axios from 'axios';
import { Table, Popconfirm } from 'antd';

class UserList extends React.Component<any, any>{
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      columns: [{
        title: '用户名',
        dataIndex: 'display_name',
        key: 'display_name'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
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
          const { id } = text;
          return (
            <span>
              <Popconfirm
                title="确认删除吗"
                okText="Yes"
                cancelText="No"
                onConfirm={() => this.handleDeleteClick(id)}
              >
                删除
              </Popconfirm>
            </span>
          )
        },
      }]
    }
  }
  componentDidMount() {
    let params = {
      page: 1,
      pageSize: 50
    }
    this.getListData(params)
  }
  handleDeleteClick = async (id: any) => {
    let { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.filter(item => item.id !== id)
    })
    await axios.delete(`api/user/${id}`)
  }
  getListData = async (params: any) => {
    let { data } = await axios.get('api/user', { params })
    this.setState({
      dataSource: data.data.data
    })
  }
  render() {
    const { columns, dataSource } = this.state
    return (
      <div style={{ margin: 20 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered={true}
          rowKey="id"
        />
      </div>
    )
  }
}

export default UserList