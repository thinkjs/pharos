import * as React from 'react';
import { Link } from "react-router-dom";
import { Menu, Layout } from "antd";
const { Header } = Layout;
import { observer, inject } from 'mobx-react';
import axios from '../../utils/axios'
import history from '../../utils/history'
import './index.less'

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
  name: '成员管理',
  url: '/people',
  sider: []
}]

const pharosUser = localStorage.getItem('pharosUser')

if (pharosUser) {
  const status = JSON.parse(pharosUser)['status']
  if (status == '1' || status == '0') {
    data.push({
      name: '系统设置',
      url: '/system',
      sider: [{
        name: '成员列表',
        url: '/users',
      }]
    })
  }
}

@inject('projectStore') @observer
class PharosHeader extends React.Component<any, any> {


  logout = async () => {
    const result = await axios.delete('/api/token');
    if (result) {
      localStorage.removeItem('pharosUser');
      localStorage.removeItem('projectId');
      history.push('/signin')
    }
  }

  componentDidMount() {
    const { projectStore } = this.props
    projectStore.getList()
  }

  render() {
    const { projectStore } = this.props
    const { projectList, projectClick, showProjectList, setShowProjectList } = projectStore

    const userInfo = localStorage.getItem('pharosUser')
    let userName = ''
    if (userInfo) {
      userName = JSON.parse(userInfo).name
    }
    const projectId = localStorage.getItem('projectId')

    let projectName = ''
    let project;
    if (projectId) {
      project = projectList.find(item => item.id == projectId)
      if (project) {
        projectName = project.name
      }
    }

    return (
      <Header
        style={{ paddingLeft: 0, width: '100%', height: '100%', backgroundColor: '#fff' }}
      >
        <div className="header-project">
          <div className="header-project__title">
            <span className="header-project__title-content">{projectName}</span>
            <span className="header-project__title-dropdown" onClick={() => setShowProjectList(true)}>下拉</span>
          </div>
          {showProjectList &&
            <div className="header-project__select">
              <ul className="header-project-list">
                {projectList.map(item => {
                  return (
                    <li key={item.id} className="header-project-item" onClick={() => projectClick(item)}>
                      <span className="hpi-name">{item.name}</span>
                      <span className="hpi-quota">
                        <span className="hpi-quota-alarm">
                          报警
                      <span className="hpi-quota-alarm-num">2</span>
                        </span>
                        <span className="hpi-quota-perf">
                          性能
                      <span className="hpi-quota-perf-num">2</span>
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div className="header-project-add"><Link to="/project/create">添加</Link></div>
            </div>}
        </div>
        <Menu
          mode="horizontal"
          theme="light"
          style={{ marginLeft: 300 }}
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
    )
  }
}

export default PharosHeader