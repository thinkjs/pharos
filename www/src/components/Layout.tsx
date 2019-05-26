import * as React from "react";
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";
import axios from '../utils/axios'
import history from '../utils/history'
import './index.less'

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

// interface mainData {
//   name: string;
//   url: string;
//   sider?: {
//     name?: string;
//     url?: string;
//   }[]
// }

const data = [{
  name: '项目列表',
  url: '/project',
  sider: []
}, {
  name: '报警',
  url: '/alarm',
  sider: [{
    name: '报警列表',
    url: '/list',
  }]
}, {
  name: '性能',
  url: '/perf',
  sider: []
}, {
  name: '项目设置',
  url: '/site',
  sider: [{
    name: '监控管理',
    url: '/monitor',
    subMenu: [{
      name: '添加自定义监控项',
      url: '/add'
    }]
  }, {
    name: '策略管理',
    url: '/strategy',
    sider: []
  }, {
    name: '成员列表',
    url: '/users',
  }]
}, {
  name: '系统设置',
  url: '/system',
  sider: [{
    name: '成员列表',
    url: '/users',
  }]
}, {
  name: '成员管理',
  url: '/people',
  sider: []
}]

class PhraosIndex extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  logout = async () => {
    const result = await axios.delete('/token');
    if (result) {
      localStorage.removeItem('isLogin');
      history.push('/signin')
    }
  }

  render() {
    const userName = localStorage.getItem('isLogin')
    const url = this.props.match.path
    const sideItem = data.find(item => item.url === url)
    if (!sideItem) return null
    return (
      <Layout>
        <Header
          style={{ paddingLeft: 0, width: '100%', height: '100%', backgroundColor: '#fff' }}
        >
          <Menu
            mode="horizontal"
            theme="light"
            style={{ marginLeft: 200 }}
            selectedKeys={[this.props.match.path]}
          >
            {data.map(item => <Menu.Item key={item.url}><Link to={item.url}>{item.name}</Link></Menu.Item>)}
          </Menu>
          <div className="user-info-wrap">
            {userName ? <div>
              <span className="user-name">{userName}</span>
              <span className="logout" onClick={this.logout}>登出</span>
            </div> : null}
          </div>
        </Header>
        <Layout>
          {sideItem.sider.length ?
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['0']}
                defaultOpenKeys={['sub0']}
              >
                {sideItem.sider.map((sd, index) => {
                  if (sd.subMenu) {
                    return <SubMenu key={`sub${index}`} title={sd.name}>
                      {sd.subMenu.map((sm, i) => <Menu.Item key={i}><Link to={`${sideItem.url}${sd.url}${sm.url}`}>{sm.name}</Link></Menu.Item>)}
                    </SubMenu>
                  }
                  return (
                    <Menu.Item key={index}><Link to={`${sideItem.url}${sd.url}`}>{sd.name}</Link></Menu.Item>
                  )
                }
                )}
              </Menu>
            </Sider> : null}
          <Layout >
            <Content style={{ margin: '24px', padding: '24px', minHeight: 280, height: '100%', backgroundColor: '#fff' }}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default PhraosIndex
