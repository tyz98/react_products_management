import React, { Component } from 'react';
import {Button} from 'antd'
import {FullscreenOutlined, FullscreenExitOutlined} from '@ant-design/icons'
import screenfull from 'screenfull'
import './css/header.less'
class Header extends Component {
  state = {
    isFullScreen:false,
  }

  toggleScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  componentDidMount() {
    screenfull.on('change',()=>{
      let isFullScreen = !this.state.isFullScreen;
      this.setState({isFullScreen});
    })
  }
  render() {
    return (
      <header className='header'>
        <div className='header-top'>
          <Button size='small' onClick={this.toggleScreen}>
            {this.state.isFullScreen ? <FullscreenExitOutlined />:<FullscreenOutlined />}
          </Button>
          <span className='welcome'>欢迎，username</span>
          <Button type="link">退出</Button>
        </div>
        <div className='header-bottom'>
          <div className="title">柱状图</div>
          <div className="today">
            <span className='time'>2020-8-18 09:48:12</span>
            <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气图标"/>
            <span className='weather'>晴</span>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;