import * as React from "react";
import { Layout, Menu, Icon } from "antd";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import Slider from "react-slick";

const { Sider, Content } = Layout;

export default class ItemList extends React.Component {
  render() {
    return (
      <Layout>
        <Sider>
          <Menu
            defaultSelectedKeys={['performance']}
            theme="dark"
            mode="inline"
          >
            <Menu.Item key="performance">
              性能指标
            </Menu.Item>
            <Menu.Item key="usermanage">
              用户管理
            </Menu.Item>
            <Menu.Item key="setting">
              项目配置
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>项目管理</Content>
      </Layout>
    );
  }
}
