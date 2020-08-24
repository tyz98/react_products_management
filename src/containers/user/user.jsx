import React, { Component } from 'react';
import {reqUserList} from '../../api'
import { message,Card,Input,Form,Modal,Table,Button } from 'antd';
import {PlusOutlined} from '@ant-design/icons'
class User extends Component {
  state={
    operation:'add',
    userList:[],
    roleList:[],
    visible:false
  }
  componentDidMount() {
    //请求用户列表
    this.getUserList();
  }

  //请求用户列表
  getUserList = async ()=>{
    const response = await reqUserList();
    console.log('response=',response)
    const {status,data} = response;
    if (status === 0) {
      this.setState({userList:data.users,roleList:data.roles})
    } else {
      message.error('获取用户信息失败',1)
    }
  }

  //“创建用户”按钮的onClick回调
  showAdd = ()=>{
    this.setState({operation:'add',visible:true});
  }
  //“修改”按钮的onClick回调
  showUpdate = ()=>{
    this.setState({operation:'update',visible:true});
  }
  //Modal中取消按钮的onClick回调
  handleCancel = (values)=>{
    this.setState({visible:false})
  }

  render() {
    const {userList,roleList,operation,visible} = this.state;
    console.log('roleList=',roleList)
    console.log('userList=',userList)
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render:(role_id)=>{
          const role = roleList.find((item)=>item._id===role_id);
          return role.name;
        }
      },
      {
        title: '操作',
        //dataIndex: 'operation',//不指定的dataIndex的话，下面render()中传入的data就是整个数据对象
        key: 'operation',
        render:(data)=>{return <Button type='link' onClick={()=>{this.showUpdate(data)}}>修改</Button>},
        // width: '25%',
        // align: 'center'
      },
    ];
    return (
      <div>
        <Card title={<Button type="primary" onClick={this.showAdd}><PlusOutlined />创建用户</Button>} >
          <Table 
            dataSource={userList} 
            columns={columns} 
            bordered={true} 
            rowKey='_id' 
            pagination={{pageSize:5,showQuickJumper:true}}
          />
        </Card>
        <Modal
          title={operation === 'add' ? "添加用户":"修改用户"}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
          forceRender
        >
            <Form
              name="userModify"
              ref={this.formRef}
              //initialValues={operation === 'update' ? { categoryName: modalValue}:{}}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '用户名不能为空!' }]}
                >
                  <Input placeholder="用户名" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '密码不能为空!' }]}
                >
                  <Input placeholder="密码" />
                </Form.Item>
            </Form>
        </Modal>
      </div>
    );
  }
}

export default User;