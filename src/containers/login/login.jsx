import React, { Component } from 'react';
import './css/login.less'
import logo from './imgs/logo.png'
import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import {createSaveUserInfoAction} from '../../redux/actions/login_action'
import {reqLogin} from '../../api'

class Login extends Component {
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    const onFinish = async values => {
      const {username, password} = values;
      //这里只定义响应成功返回的回调，响应失败的在响应拦截器中处理
      const response = await reqLogin(username,password);
      if (response.status === 0) {
        console.log('登录成功，可以跳转到admin了',response.data);
        //save userInfo to redux(store)
        console.log('先把用户信息存到store')
        this.props.saveUserInfo(response.data);
        //go to /admin
        console.log('再用replace跳转')
        this.props.history.push('/admin');
      } else {
        message.warning('用户名或密码输入不正确，请重新输入',1);
      }

     // console.log('可发ajax请求，表单的值为: ', values);
    };
    const onFinishFailed = ({values, errorFields, outOfDate}) => {
      console.log('表单数据验证失败',values,errorFields,outOfDate);
    };
    return (
      <div className='login'>
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form
            name="login"
            className="login-form"
            onFinish={onFinish} 
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
                {
                  max: 12,
                  message:'用户名长度不可超过12位!'
                },
                {
                  min: 4,
                  message:'用户名长度不可少于4位!'
                },
                {
                  pattern:/^\w+$/,
                  message:'用户名只能由数字、字母、下划线组成!'
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}}/>}
                placeholder="用户名" 
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  validator:(rule, value, callback)=>{
                    try {
                      if (!value) {
                        return Promise.reject('密码不能为空！')
                      } else if (!(/^\w+$/.test(value))) {
                        return Promise.reject('密码只能由数字、字母、下划线组成！');
                      } else if (value.length < 4) {
                        return Promise.reject('密码不可少于4位！');
                      } else if (value.length > 12) {
                        return Promise.reject('密码不可超过12位！');
                      } 
                      return Promise.resolve();
                    } catch(err) {
                      callback(err);
                    }
                  }
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}}/>}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}

export default connect(
  state => ({test:state.test}),
  {
    saveUserInfo:createSaveUserInfoAction,
  }
)(Login)