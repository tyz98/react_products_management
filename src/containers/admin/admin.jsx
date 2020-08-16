import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

class Admin extends Component {
  componentDidMount() {
    console.log(this.props.userInfo);
  }
  render() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
      return (
        <div>
          Hello, {user.username}!
        </div>
      );
    }
    //const {userInfo} = this.props;
    return <Redirect to='/login'/>;
  }
}

export default connect(
  state => ({userInfo:state.userInfo}),
  {}
)(Admin);
