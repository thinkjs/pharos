import * as React from 'react';
import { Link } from "react-router-dom";
import { Menu, Layout } from "antd";
const { Header } = Layout;
import axios from '../../utils/axios'
import history from '../../utils/history'
import './index.less'

class PharosHeader extends React.Component {

  logout = async () => {
    const result = await axios.delete('/token');
    if (result) {
      localStorage.removeItem('isLogin');
      history.push('/signin')
    }
  }

  async componentDidMount() {

  }

  render() {
    const userName = localStorage.getItem('isLogin')
    return (
      <Header
        style={{ paddingLeft: 0 }}
      >
        <Menu
          // selectedKeys={[location.pathname]}
          mode="horizontal"
          theme="dark"
          style={{ marginLeft: 200 }}
        >
          <Menu.Item key="1">
            <Link to="/project">项目列表</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/alarm">报警</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/perf">性能</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/site">项目设置</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/system">系统设置</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/people">成员管理</Link>
          </Menu.Item>
        </Menu>
        <div className="user-info-wrap">
          {userName ? <div>
            <span className="user-name">{userName}</span>
            <span className="logout" onClick={this.logout}>登出</span>
          </div> : null}
        </div>
      </Header>
    )
  }
}

export default PharosHeader