import * as React from "react";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import { Menu, Layout } from "antd";
import Manage from './manage';
import Analyse from './analyse'
import ItemList from './itemlist';

const { Header } = Layout;

export const Index = () => (
  <Layout style={{ height: "100%" }}>
    <Router>
      <Header
        style={{ paddingLeft: 0, height: 46 }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="horizontal"
          theme="dark"
          style={{ marginLeft: 200 }}
        >
          <Menu.Item key="1">
            <Link to="/">项目管理</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/analyse">性能分析</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/list">项目列表</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Route path="/" exact component={Manage} />
        <Route path="/analyse" exact component={Analyse} />
        <Route path="/list" exact component={ItemList} />
      </Layout>
    </Router>
  </Layout>
);
