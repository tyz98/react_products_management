import React, { Component } from 'react'

export default class AddUpdate extends Component {
  
  render() {
    return (
      <div>
        add/update
        {this.props.match.params.id}
      </div>
    )
  }
}
