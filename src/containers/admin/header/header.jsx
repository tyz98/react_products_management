import React, { Component } from 'react';
import {Button, Modal} from 'antd'
import {FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import screenfull from 'screenfull'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import dayjs from 'dayjs'
import {createDeleteUserInfoAction} from '../../../redux/actions/login_action'
//import {reqWeather} from '../../../api'
import './css/header.less'
const { confirm } = Modal;

@withRouter
@connect(
  state=>({userInfo:state.userInfo}),
  {deleteUserInfo:createDeleteUserInfoAction}
)
class Header extends Component {
  state = {
    isFullScreen:false,
  }

  async componentDidMount() {
    //listen screenfull change
    screenfull.on('change',()=>{
      let isFullScreen = !this.state.isFullScreen;
      this.setState({isFullScreen});
    })
    //change time every 1 second
    this.timerID = setInterval(() => {
      this.setState({time:dayjs().format('YYYY-MM-DD HH:mm:ss')});
    }, 1000);
    
    // //request weather
    // let weatherInfo = await reqWeather();
    // console.log(weatherInfo)
    // this.setState({weather:weatherInfo.wea,lowTem:weatherInfo.tem2,highTem:weatherInfo.tem1})
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  //toggle full screen(button onclick)
  toggleScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  //loggout onclick
  logout = () => {
    confirm({
      title: '你确认要退出登录吗？',
      icon: <ExclamationCircleOutlined />,
      content: '退出后需重新登录',
      onOk : () => {//用箭头函数，这样this才能是组件
        this.props.deleteUserInfo();
      },
      onCancel : () => {
      },
      okText:"确认",
      cancelText:"取消",
    });
  }

  render() {
    let {user} = this.props.userInfo;
    let {time, isFullScreen,weather,lowTem,highTem} = this.state;
    return (
      <header className='header'>
        <div className='header-top'>
          <Button size='small' onClick={this.toggleScreen}>
            {isFullScreen ? <FullscreenExitOutlined />:<FullscreenOutlined />}
          </Button>
          <span className='welcome'>欢迎，{user.username}</span>
          <Button type="link" onClick={this.logout}>退出</Button>
        </div>
        <div className='header-bottom'>
          <div className="title">
            {this.props.location.pathname}
          </div>
          <div className="today">
          <span className='time'>{time}</span>
          <span className='weather'>{weather} {lowTem}~{highTem}℃</span>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;