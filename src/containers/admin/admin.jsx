import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {createDeleteUserInfoAction} from '../../redux/actions/login_action'

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

  render() {
    const {user,isLogin} = this.props.userInfo;
    if (isLogin) {
      return (
        <div>
          <div>
            Hello, {user.username}!
          </div>
          <button onClick={this.logout}>退出登录</button>
        </div>
      );
    }
    //const {userInfo} = this.props;
    return <Redirect to='/login'/>;
  }
}

export default Admin;
