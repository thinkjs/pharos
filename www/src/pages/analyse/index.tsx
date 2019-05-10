import * as React from "react";
import { Layout } from "antd";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";

const { Sider, Content } = Layout;

export default class Analyse extends React.Component {
  render() {
    return (
      <Layout>
        <Content>性能分析</Content>
      </Layout>
    );
  }
}
