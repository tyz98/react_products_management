import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import './css/left_nav.less'
import logo from './imgs/logo.png'
import menuList from '../../../config/menu-config'
const { SubMenu } = Menu;

@withRouter
class LeftNav extends Component {
  componentDidMount() {
    console.log('leftnav componentDidMount')
  }
  //create menu(递归)
  createMenu(tagArr) {
    return tagArr.map((item)=>{
      const {title,key,icon,path,children} = item;
      if (!children) {
        return (
          <Menu.Item key={key} icon={icon}>
            <Link to={path}>{title}</Link>
          </Menu.Item>
        )         
      } else {
        return (
          <SubMenu key={key} icon={icon} title={title}>
            {this.createMenu(children)}
          </SubMenu>
        )
      }
    })
  }
  render() {
    console.log('render() left-nav')
    return (
      <div className="menu">
        <div className='title'>
          <img src={logo} alt="图标"/>
          商品管理系统
        </div>
        <Menu
          defaultSelectedKeys={[this.props.location.pathname.split('/').reverse()[0]]}
          defaultOpenKeys={this.props.location.pathname.split('/')}
          mode="inline"
          theme="dark"
        >
          {
            this.createMenu(menuList)
          } 

        </Menu>
      </div>
    );
  }
}

export default LeftNav;