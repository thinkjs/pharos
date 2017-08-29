import React from 'react';
// import PropTypes from 'prop-types'
import { Layout , Menu } from 'antd';
const { Header } = Layout;
import styles from '../index.less'

const MainHeader = () => {
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.png" alt=""/>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">菜单1</Menu.Item>
        <Menu.Item key="2">菜单2</Menu.Item>
        <Menu.Item key="3">菜单3</Menu.Item>
      </Menu>
    </Header>
  )
}

// Header.propTypes = {
//   menu: PropTypes.array,
// }

export default MainHeader
