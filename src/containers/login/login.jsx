import React, { Component } from 'react';
import './css/login.less'
import logo from './imgs/logo.png'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import {createDemo1Action, createDemo2Action} from '../../redux/actions/test_action'

class Login extends Component {
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    const onFinish = values => {
      console.log('可发ajax请求，表单的值为: ', values);
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
    demo1:createDemo1Action,
    demo2:createDemo2Action,
  }
)(Login)