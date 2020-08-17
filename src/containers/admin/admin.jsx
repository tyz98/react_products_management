import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {createDeleteUserInfoAction} from '../../redux/actions/login_action'
import {reqCategoryList} from '../../api'

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
    const {user,isLogin} = this.props.userInfo;
    if (isLogin) {
      return (
        <div>
          <div>
            Hello, {user.username}!
          </div>
          <button onClick={this.logout}>退出登录</button>
          <button onClick={this.catogories}>获取商品列表</button>
        </div>
      );
    }
    //const {userInfo} = this.props;
    return <Redirect to='/login'/>;
  }
}

export default Admin;
