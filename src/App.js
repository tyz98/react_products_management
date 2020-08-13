import React,{Component} from 'react';
import {Button, Input} from 'antd';
//import "antd/dist/antd.css";

export default class App extends Component {
  render() {
    return (
      <div>
        <Button type="primary">这是antd的Button</Button>
        <Input type="text"></Input>
      </div>
    )
  }
}
