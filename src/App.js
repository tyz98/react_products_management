import React,{Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
//import {Button, Input} from 'antd';
//配置按需引入后不需这样引入全部css，根据上一行antd的组件可以直接引入需要的css
//import "antd/dist/antd.css";
import Login from './containers/login/login'
import Admin from './containers/admin/admin'

export default class App extends Component {
  render() {
    return (
      <div id='app'>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/admin' component={Admin}/>
          <Redirect to='/admin'/>
        </Switch>
      </div>
    )
  }
}
