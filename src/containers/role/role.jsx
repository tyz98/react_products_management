import React, { Component } from 'react';
import {Button, Card, Table, Modal, Input} from 'antd'
import { PlusOutlined } from '@ant-design/icons';

class Role extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const roleList = [{_id:-1,name:'aaa',createTime:200,authTime:300,authPerson:'BB'}]
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '授权时间',
        dataIndex: 'authTime',
        key: 'authTime',
      },
      {
        title: '授权人',
        dataIndex: 'authPerson',
        key: 'authPerson',
      },
      {
        title: '操作',
        key:'operation',
        render:(item)=>{
          return <Button type='link' onClick={()=>{}}>设置权限</Button>
        },
        align:'center',
      }
    ];
    return (
      <div>
        <Card 
        title={<Button type="primary" onClick={this.showModal}><PlusOutlined/>新增角色</Button>} >
          <Table 
          dataSource={roleList} 
          columns={columns} 
          rowKey='_id'
          bordered
          />{/*点击页码时请求该页数据*/}
        </Card>
        <Modal
          title="新增角色"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input placeholder='请输入角色名'></Input>
        </Modal>
      </div>

    );
  }
}

export default Role;