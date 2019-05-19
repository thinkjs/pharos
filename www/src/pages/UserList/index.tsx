import * as React from "react";
import axios from 'axios';
import { Layout, Table, Input, Divider, Popconfirm } from 'antd';

const { Content } = Layout;
const { Search } = Input;
interface InitState {
  columns: any,
  dataSource: any
}

class UserList extends React.Component<null, InitState>{
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      columns: [{
        title: '用户名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'emai',
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
          const { id, name, url } = text;
          console.log(text, 'text');
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
      pageSize: 20
    }
    this.getListData(params)
  }
  handleDeleteClick = (id: any) => {
    let { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.filter(item => item.id !== id)
    })
    let res = axios.delete(`api/user/${id}`)
  }
  getListData = async (params: any) => {
    let { data } = await axios.get('api/user', { params })
    this.setState({
      dataSource: data.data
    })
  }
  render() {
    const { columns, dataSource } = this.state
    return (
      <Layout>
        <Content
          style={{ margin: 20, background: '#fff' }}
        >
          <div style={{ margin: 30 }}>
            <Table
              columns={columns}
              dataSource={dataSource}
              bordered={true}
            />
          </div>
        </Content>
      </Layout>
    )
  }
}

export default UserList