import React from 'react';
import { Layout , Menu, Icon } from 'antd';
import styles from '../index.less';
import { Link } from 'dva/router';
import {menus} from 'utils';

const { SubMenu } = Menu;

const MainSlider = () => {

  const renderMenu = ()=>{
    let tree = [];
    const renderChildren = (menu)=>{
      const children = menu.children;
      if(!children || children.length === 0){
        return(
          <Menu.Item key={menu.url}>
            <Link className={styles.menuItem} to={menu.url}>{menu.name}</Link>
          </Menu.Item>
        )
      }
      return (
        <SubMenu key={menu.name} title={<span>{menu.icon?<Icon type={menu.icon} />:null}{menu.name}</span>}>
          {
            children.map(c=>{
              return renderChildren(c)
            })
          }
        </SubMenu>        
      )
    }
    menus.map((m,i)=>{
      if(m.url){
        tree.push(
          <Menu.Item key={m.url}>
            <Link className={styles.menuItem} to={m.url}><Icon type={m.icon} />{m.name}</Link>
          </Menu.Item>
        )
      }else{
        tree.push(
          renderChildren(m)
        );
      }
    })
    return tree;
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

export default MainSlider
