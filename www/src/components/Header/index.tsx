import * as React from 'react';
import { Link } from "react-router-dom";
import { Menu, Layout } from "antd";
const { Header } = Layout;
import { observer, inject } from 'mobx-react';
import Icon from '@components/Icon'
import axios from '@utils/axios'
import history from '@utils/history'
import './index.less'

const data = [{
  name: '监控',
  url: '/monitor',
}, {
  name: '报警',
  url: '/alarm'
}, {
  name: '项目设置',
  url: '/site'
}, {
  name: '系统设置',
  url: '/system',
}]


@inject('projectStore') @observer
class PharosHeader extends React.Component<any, any> {

  state = {
    data: data
  }

  logout = async () => {
    const result = await axios.delete('/api/token');
    if (result) {
      localStorage.removeItem('pharosUser');
      localStorage.removeItem('projectId');
      history.push('/signin')
    }
  }

  isDomain = () => {
    const pharosUser = localStorage.getItem('pharosUser')

    if (pharosUser) {
      const status = JSON.parse(pharosUser)['status']
      if (status == '0') {
        this.setState({
          data: this.state.data.slice(0, 3)
        })
      }
    }
  }

  componentDidMount() {
    const { projectStore } = this.props
    projectStore.getList()
    this.isDomain()
  }

  render() {
    const { projectStore } = this.props
    const { projectList, projectClick, showProjectList, setShowProjectList, showUserInfo, setShowUserInfo } = projectStore

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
      <Header>
        <div className="header-project">
          <div className="header-project__title">
            <span className="header-project__title-content">{projectName}</span>
            <span className="header-project__title-dropdown" onClick={() => setShowProjectList(true)}>{showProjectList ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}</span>
          </div>
          {showProjectList &&
            <div className="header-project__select--wrap" onClick={() => setShowProjectList(false)}>
              <div className="header-project__select">
                <ul className="header-project-list">
                  {projectList.map(item => {
                    return (
                      <li key={item.id} className="header-project-item" onClick={() => projectClick(item)}>
                        <span className="hpi-name">{item.name}</span>
                        {/* <span className="hpi-quota">
                          <span className="hpi-quota-alarm">
                            报警
                        <span className="hpi-quota-alarm-num">2</span>
                          </span>
                          <span className="hpi-quota-perf">
                            性能
                        <span className="hpi-quota-perf-num">2</span>
                          </span>
                        </span> */}
                      </li>
                    )
                  })}
                </ul>
                <div className="header-project-add"><Link to="/project/create"><Icon type="plus" /></Link></div>
              </div>
            </div>}
        </div>
        <Menu
          mode="horizontal"
          style={{ paddingLeft: 230 }}
          selectedKeys={[this.props.match.path]}
        >
          {this.state.data.map(item => <Menu.Item key={item.url}><Link to={item.url}>{item.name}</Link></Menu.Item>)}
        </Menu>
        <div className="user-info-wrap">
          {userName ?
            <div className="user-info">
              <div className="user-info-title" onClick={() => setShowUserInfo(!showUserInfo)}>
                <span className="user-name">{userName}</span>
                <Icon type="arrow-down" />
              </div>
              {showUserInfo && <div className="user-info-list">
                <div className="user-info-item">
                  <span className="logout" onClick={this.logout}>登出</span>
                </div>
              </div>}
            </div>
            :
            null}
        </div>
      </Header>
    )
  }
}

export default PharosHeader