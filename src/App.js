import React,{Component} from 'react';
import {Switch, Route} from 'react-router-dom'
//import {Button, Input} from 'antd';
//配置按需引入后不需这样引入全部css，根据上一行antd的组件可以直接引入需要的css
//import "antd/dist/antd.css";
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/admin' component={Admin}/>
        </Switch>
      </div>
    )
  }
}
