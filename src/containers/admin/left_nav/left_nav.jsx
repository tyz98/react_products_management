import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import { Menu } from 'antd';
import {createSaveTitleAction} from '../../../redux/actions/menu_action'
import menuList from '../../../config/menu-config'
import './css/left_nav.less'
import logo from './imgs/logo.png'

const { SubMenu } = Menu;

@withRouter
@connect(
  state=>({menus:state.userInfo.user.role.menus,username:state.userInfo.user.username}),
  {saveTitle:createSaveTitleAction}
)
class LeftNav extends Component {
  componentDidMount() {
    console.log('leftnav componentDidMount')
  }
  //create menu(递归)
  createMenu(tagArr) {
    return tagArr.map((item)=>{
      if(!this.hasAuth(item)) return;//没有权限查看则直接返回
      const {title,key,icon,path,children} = item;
      if (!children) {
        return (
          <Menu.Item key={key} icon={icon} onClick={()=>{this.props.saveTitle(title)}}>
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

  //检测所在用户是否有权限查看某个菜单
  hasAuth = (item)=>{
    const{menus,username} = this.props;
    if(username === "admin") return true;//超级管理员具有所有权限
    const menu = item.key;//当前检测的菜单的key
    const children = item.children;//当前检测菜单的children
    if (menus.indexOf(menu) !== -1) return true;//如果直接在menus中找到对应的key,则有权限
    if(!children) return false;//如果直接在menus没有对应的key,且无孩子，则无权限
    return children.some(this.hasAuth);//数组的.some方法，测试数组中的元素是否至少有一个通过了所提供的函数的测试
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
          defaultSelectedKeys={[this.props.location.pathname.indexOf('product')!==-1?'product':this.props.location.pathname.split('/').reverse()[0]]}
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