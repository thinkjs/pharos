import React from 'react';
// import PropTypes from 'prop-types'
import { config,menus } from 'utils'
import { Layout , Menu } from 'antd';
import { Link } from 'dva/router';
import User from './user';
import ProjectSelector from './project-selector'
import styles from '../index.less'
const { Header } = Layout;

const MainHeader = ({data}) => {
  const {header} = data;
  const {onChangeMenu} = header;

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
        defaultSelectedKeys={[menus[0].key]}
        style={{ lineHeight: '64px' }}
      >
        {
          menus.map(item=>{
            return (
              <Menu.Item key={item.key}>
                <Link to={item.url} onClick={()=>{onChangeMenu(item.key)}}>{item.name}</Link>
              </Menu.Item>
            )
          })
        }
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
