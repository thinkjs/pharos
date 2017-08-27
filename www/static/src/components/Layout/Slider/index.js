import React from 'react';
import { Layout , Menu, Icon } from 'antd';
import styles from '../index.less'
import { Link } from 'dva/router'
import {menus} from 'utils';

const { SubMenu } = Menu;

const MainSlider = () => {

  const renderMenu = ()=>{
    const renderChildren = (menu)=>{
      const children = menu.children || [];
      if(children.length === 0){
        return;
      }
      return children.map((c,i)=>{
        return (
          <Menu.Item key={i}>
            <Link className={styles.menuItem} to={c.url}>{c.name}</Link>
          </Menu.Item>
        )
      })
    }
    return menus.map((m,i)=>{
      if(m.url){
        return (
          <Menu.Item key={i}>
            <Link className={styles.menuItem} to={m.url}>{m.name}</Link>
          </Menu.Item>
        )
      }
      return (
        <SubMenu key={i} title={<span><Icon type={m.icon} />{m.name}</span>}>
          {renderChildren(m)}
        </SubMenu>
      )
    })
  };


  return (
    <div className={styles.slider}>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        {renderMenu()}
      </Menu>
    </div>
  )
}

// Header.propTypes = {
//   menu: PropTypes.array,
// }

export default MainSlider
