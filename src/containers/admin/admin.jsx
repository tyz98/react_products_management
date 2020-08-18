import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Redirect, Switch, Route} from 'react-router-dom'
import { Layout, Button } from 'antd';
import {reqCategoryList} from '../../api'
import Header from './header/header'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'
import './css/admin.less'
const {Footer, Sider, Content} = Layout;

@connect(
  state => ({userInfo:state.userInfo}),
  {}
)
class Admin extends Component {
  componentDidMount() {
    console.log(this.props.userInfo);
  }



  categories = async() => {
    console.log('开始获取商品列表')
    let categoryList = await reqCategoryList();
    console.log(categoryList);
  }

  render() {
    const {isLogin} = this.props.userInfo;
    if (isLogin) {
      return (
        <Layout className='admin'>
          <Sider className='sider'>Sider</Sider>
          <Layout>
            <Header/>
            <Content className='content'>
              <Switch>
                <Route path="/admin/home" component={Home}/>
                <Route path="/admin/prod_about/category" component={Category}/>
                <Route path="/admin/prod_about/product" component={Product}/>
                <Route path="/admin/user" component={User}/>
                <Route path="/admin/role" component={Role}/>
                <Route path="/admin/charts/bar" component={Bar}/>
                <Route path="/admin/charts/line" component={Line}/>
                <Route path="/admin/charts/pie" component={Pie}/>
                <Redirect to="/admin/home"/>
              </Switch>
            </Content>
            <Footer className='footer'>推荐使用谷歌浏览器
            <Button onClick={this.categories}>获取商品列表</Button>
            </Footer>
            
          </Layout>
        </Layout>
      );
    }
    //const {userInfo} = this.props;
    return <Redirect to='/login'/>;
  }
}

export default Admin;
