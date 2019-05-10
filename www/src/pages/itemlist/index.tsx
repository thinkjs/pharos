import * as React from "react";
import { Layout, Input, Button, Table, Divider, Tag } from "antd";
const { Content } = Layout;

const Search = Input.Search;

const columns = [{
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: '网站名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '地址',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '创建',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">Invite {record.name}</a>
      <Divider type="vertical" />
      <a href="javascript:;">Delete</a>
    </span>
  ),
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park'
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];
export default class ItemList extends React.Component {
  render() {
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
              <Table columns={columns} dataSource={data} />
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}
