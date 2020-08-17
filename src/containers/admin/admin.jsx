import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import { Layout } from 'antd';
import {createDeleteUserInfoAction} from '../../redux/actions/login_action'
import {reqCategoryList} from '../../api'
import Header from './header/header'
import './css/admin.less'

@connect(
  state => ({userInfo:state.userInfo}),
  {deleteUserInfo:createDeleteUserInfoAction}
)
class Admin extends Component {
  componentDidMount() {
    console.log(this.props.userInfo);
  }

  logout = () => {
    this.props.deleteUserInfo();
  }

  catogories = async() => {
    let categoryList = await reqCategoryList();
    console.log(categoryList);
  }

  render() {
    const {isLogin} = this.props.userInfo;
    const {Footer, Sider, Content} = Layout;
    if (isLogin) {
      return (
        <Layout className='admin'>
          <Sider className='sider'>Sider</Sider>
          <Layout>
            <Header/>
            <Content className='content'>Content</Content>
            <Footer className='footer'>推荐使用谷歌浏览器</Footer>
          </Layout>
        </Layout>
      );
    }
    //const {userInfo} = this.props;
    return <Redirect to='/login'/>;
  }
}

export default Admin;
