import React, { Component } from 'react';

class Home extends Component {
  componentDidMount() {
    console.log('home componentDidMount')
  }
  render() {
    console.log('render() home')
    return (
      <div>
        欢迎来到商品管理系统
      </div>
    );
  }
}

export default Home;