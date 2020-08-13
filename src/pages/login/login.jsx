import React, { Component } from 'react';
import './css/login.less'
import logo from './imgs/logo.png'

class Login extends Component {
  render() {
    return (
      <div className='login'>
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          以后会加上antd的form组件
        </section>
      </div>
    );
  }
}

export default Login;