import React, { Component } from 'react';
import {connect} from 'react-redux'
//import {createDemo1Action, createDemo2Action} from '../../redux/actions/login_action'
class Admin extends Component {
  componentDidMount() {
    console.log(this.props.userInfo);
  }
  render() {
    const {userInfo} = this.props;
    return (
      <div>
        Hello, {userInfo.user.username}!
      </div>
    );
  }
}

export default connect(
  state => ({userInfo:state.userInfo}),
  {}
)(Admin);
