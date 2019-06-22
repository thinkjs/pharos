import * as React from "react";
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";
import Header from '@components/Header'
import './index.less'

const { SubMenu } = Menu;
const { Sider, Content } = Layout;


const data = [{
  name: '监控',
  url: '/monitor',
  sider: [{
    name: '报错',
    url: '/error',
    subMenu: [{
      name: '图表',
      url: '/picture'
    }, {
      name: '列表',
      url: '/list'
    }]
  }, {
    name: '自定义监控图表',
    url: '/custom'
  }, {
    name: '性能图表',
    url: '/perf'
  }]
}, {
  name: '报警',
  url: '/alarm',
  sider: [{
    name: '报警列表',
    url: '/list',
  }]
}, {
  name: '项目设置',
  url: '/site',
  sider: [{
    name: '监控管理',
    url: '/metric',
    subMenu: [{
      name: '添加自定义监控项',
      url: '/'
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
    name: '用户列表',
    url: '/users'
  }]
}]



class PhraosLayout extends React.Component<any, any> {

  render() {
    const url = this.props.match.path
    const sideItem = data.find(item => item.url === url)
    if (!sideItem) return null

    const pathname = this.props.location.pathname.split('/')
    const path = '/' + pathname[pathname.length - 1]

    const openPath = '/' + pathname['2']

    return (
      <>
        <Header {...this.props} />
        <Layout className="pharos-layout">
          {sideItem.sider.length ?
            <Sider className="pharos-layout__sider">
              <Menu
                mode="inline"
                defaultOpenKeys={[openPath]}
                selectedKeys={[path]}
              >
                {sideItem.sider.map((sd) => {
                  if (sd.subMenu) {
                    return <SubMenu key={sd.url} title={sd.name}>
                      {sd.subMenu.map((sm) => <Menu.Item key={sm.url}><Link to={`${sideItem.url}${sd.url}${sm.url}`}>{sm.name}</Link></Menu.Item>)}
                    </SubMenu>
                  }
                  return (
                    <Menu.Item key={sd.url}><Link to={`${sideItem.url}${sd.url}`}>{sd.name}</Link></Menu.Item>
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
