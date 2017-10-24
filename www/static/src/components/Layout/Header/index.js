import React from 'react';
// import PropTypes from 'prop-types'
import { config } from 'utils'
import { Layout , Menu } from 'antd';
const { Header } = Layout;
import User from './user';
import ProjectSelector from './project-selector'
import styles from '../index.less'

const MainHeader = ({data}) => {
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>
        <img src={config.logo} alt=""/>
        <h2>Pharos</h2>
      </div>
      <Menu
        theme="dark"
        style={{display:'inline-block'}}
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">前端监控</Menu.Item>
        <Menu.Item key="2">其他监控</Menu.Item>
      </Menu>
      <User user={data.user} />
      <ProjectSelector site={data.site} />
    </Header>
  )
}

// Header.propTypes = {
//   menu: PropTypes.array,
// }

export default MainHeader
