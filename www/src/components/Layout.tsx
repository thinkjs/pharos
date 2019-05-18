import * as React from "react";
import { Menu, Layout } from "antd";
import Header from './Header/index'

const { Sider, Content } = Layout;

class PhraosIndex extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <>
        <Header />
        <Layout >
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
          <Content>{this.props.children}</Content>

        </Layout>
      </>
    )
  }
}

export default PhraosIndex
