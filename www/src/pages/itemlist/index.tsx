import * as React from "react";
import axios from 'axios';
import {
  Layout,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Modal,
  Form
}
  from "antd";
const { Content } = Layout;

const Search = Input.Search;

interface Props {
  visible?: boolean,
  keyValue?: any,
  name?: string,
  address?: string,
  onCancle?: any,
  onCancel?: any,
  onCreate?: any,
  form?: any
}

class ModelForm extends React.Component<Props>{
  constructor(props) {
    super(props)
  }
  render() {
    const { visible, onCancel, onCreate, form, name, address } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="提示"
        visible={visible}
        onOk={onCreate}
        onCancel={onCancel}
      >
        <Form onSubmit={() => { }} className="login-form">
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input />,
            )}
          </Form.Item>
          <Form.Item label="地址">
            {getFieldDecorator('address', {
              initialValue: address,
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const ExtendModel = Form.create()(ModelForm)

export default class ItemList extends React.Component<Props, any> {
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
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '创建时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '操作',
        key: 'action',
        render: (text) => {
          const { key, name, address } = text;
          return (
            <span>
              <span >获取代码</span>
              <Divider type="vertical" />
              <span onClick={() => this.handleEdit(key, name, address)}>编辑</span>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除吗"
                okText="Yes"
                cancelText="No"
                onConfirm={() => this.handleDeleteClick(key)}
              >
                删除
              </Popconfirm>
            </span>
          )
        },
      }],
      data: [{
        key: '11dfghjk',
        name: 'John Brown',
        time: 32,
        address: 'New York No. 1 Lake Park'
      },
      {
        key: '22456789',
        name: 'Jim Green',
        time: 42,
        address: 'London No. 1 Lake Park'
      },
      {
        key: '3322',
        name: 'Joe Black',
        time: 32,
        address: 'Sidney No. 1 Lake Park',
      }],
      visible: false
    }
  }
  handleDeleteClick = (key: any) => {
    let { data } = this.state;
    this.setState({
      data: data.filter(item => item.key !== key)
    })
  }
  handleEdit = (key, name, address) => {
    this.setState({
      key,
      name,
      address,
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
    const listData = await axios.get('/api/site', value)
    console.log(listData)
  }
  onCancle = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    const { columns, data, key, name, address, visible } = this.state
    return (
      <Layout>
        <Content
          style={{ margin: 20, background: '#fff' }}
        >
          <div style={{ margin: 20 }}>
            <div>
              <Search
                placeholder="请输入用户名"
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
              />
              <Button type="primary" style={{ float: 'right' }}>新增</Button>
            </div>
            <div style={{ marginTop: 30 }}>
              <Table
                columns={columns}
                dataSource={data}
                bordered={true}
                onRow={record => {
                  return {
                    onClick: event => { }, // 点击行
                    onDoubleClick: event => { },
                    onContextMenu: event => { },
                    onMouseEnter: event => { }, // 鼠标移入行
                    onMouseLeave: event => { },
                  };
                }}
              />
            </div>
          </div>
        </Content>
        <ExtendModel
          visible={visible}
          keyValue={key}
          name={name}
          address={address}
          onCancle={this.onCancle}
        />
      </Layout>
    );
  }
}
