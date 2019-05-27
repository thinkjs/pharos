import * as React from "react";
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";
import axios from '../utils/axios'
import history from '../utils/history'
import Header from './Header'

const { SubMenu } = Menu;
const { Sider, Content } = Layout;


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
    const result = await axios.delete('/api/token');
    if (result) {
      localStorage.removeItem('pharosUser');
      history.push('/signin')
    }
  }

  render() {
    const url = this.props.match.path
    const sideItem = data.find(item => item.url === url)
    if (!sideItem) return null
    return (
      <Layout>
        <Header {...this.props} />
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
