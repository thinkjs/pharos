import * as React from "react";
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";
import Header from '@components/Header'
import './index.less'

const { SubMenu } = Menu;
const { Sider, Content } = Layout;


const data = [{
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
    url: '/metric',
    subMenu: [{
      name: '添加自定义监控项',
      url: '/'
    },]
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
}]

class PhraosLayout extends React.Component<any, any> {

  render() {
    const url = this.props.match.path
    const sideItem = data.find(item => item.url === url)
    if (!sideItem) return null
    return (
      <>
        <Header {...this.props} />
        <Layout className="pharos-layout">
          {sideItem.sider.length ?
            <Sider className="pharos-layout__sider">
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
          <Content className="pharos-layout__content">
            {this.props.children}
          </Content>
        </Layout>
      </>
    )
  }
}

export default PhraosLayout
