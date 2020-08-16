import React, { Component } from 'react';
import {connect} from 'react-redux'
import {createDemo1Action, createDemo2Action} from '../../redux/actions/test_action'
class Admin extends Component {
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return (
      <div>
        admin
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
)(Admin);
