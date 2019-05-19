import * as React from "react";
import axios from 'axios';
import {
  Layout,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Modal
}
  from "antd";
const { Content } = Layout;

const { Search } = Input;

interface InitState {
  columns: any,
  data: any,
  visible: any,
  name: any,
  id: any,
  addvisible: any,
  url: any
}


export default class ItemList extends React.Component<null, InitState>{
  constructor(props) {
    super(props)
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
          const { id, name, url } = text;
          console.log(text, 'text');
          return (
            <span>
              <span >获取代码</span>
              <Divider type="vertical" />
              <span onClick={() => this.handleEdit(id, name, url)}>编辑</span>
              <Divider type="vertical" />
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
      }],
      data: [],
      visible: false,
      id: '',
      name: '',
      url: '',
      addvisible: false
    }
  }
  handleDeleteClick = (id: any) => {
    let { data } = this.state;
    this.setState({
      data: data.filter(item => item.id !== id)
    })
    let res = axios.delete(`api/site/${id}`)
  }
  handleEdit = (id, name, url) => {
    this.setState({
      id,
      name,
      url,
      visible: true
    })
  }
  componentDidMount() {
    let value = {
      page: 1,
      pagesize: 10
    }
    this.getListdata(value)
  }
  getListdata = async (value: object) => {
    const { data } = await axios.get('/api/site', { params: value })
    this.setState({
      data: data.data
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  handleOk = async () => {
    const { id, name } = this.state
    const res = axios.put(`/api/site/${id}`, { name })
  }
  handleNameInput = (e) => {
    this.setState({
      name: e.currentTarget.value
    })
  }
  handleAddressInput = e => {
    this.setState({
      url: e.currentTarget.value
    })
  }
  handleAddCancel = () => {
    this.setState({
      addvisible: false
    })
  }
  openAddModal = () => {
    this.setState({
      addvisible: true
    })
  }
  handleAddOk = async () => {
    const { name, url } = this.state
    const res = await axios.post('/api/site', {
      name,
      url
    })
    this.setState({
      addvisible: false,
      data: [...this.state.data, { name, url }]
    })
    console.log(res)
  }
  handleSearch = (value) => {
    let data = {
      page: 1,
      pagesize: 10,
      keywords: value
    }
    this.getListdata(data)
  }
  render() {
    const { columns, data, name, url, visible, addvisible } = this.state
    return (
      <Layout>
        <Content
          style={{ margin: 20, background: '#fff' }}
        >
          <div style={{ margin: 20 }}>
            <div>
              <Search
                placeholder="请输入用户名"
                onSearch={value => this.handleSearch(value)}
                style={{ width: 200 }}
              />
              <Button type="primary" style={{ float: 'right' }} onClick={() => this.openAddModal()}>新增</Button>
            </div>
            <div style={{ marginTop: 30 }}>
              <Table
                columns={columns}
                dataSource={data}
                bordered={true}
              />
            </div>
          </div>
        </Content>
        <Modal
          title="修改信息"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <div style={{ marginBottom: 30 }}>
            <span>名字</span>
            <Input placeholder="请输入名字" value={name} onChange={(e) => this.handleNameInput(e)} />
          </div>
          <div>
            <span>网址</span>
            <Input placeholder="请输入名字" value={url} onChange={(e) => this.handleAddressInput(e)} />
          </div>
        </Modal>
        <Modal
          title="网站信息"
          visible={addvisible}
          onOk={this.handleAddOk}
          onCancel={this.handleAddCancel}>
          <div style={{ marginBottom: 30 }}>
            <span>名字</span>
            <Input placeholder="请输入名字" value={name} onChange={(e) => this.handleNameInput(e)} />
          </div>
          <div>
            <span>网址</span>
            <Input placeholder="请输入名字" value={url} onChange={(e) => this.handleAddressInput(e)} />
          </div>
        </Modal>
      </Layout>
    );
  }
}



