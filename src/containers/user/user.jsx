import React, { Component } from 'react';
import dayjs from 'dayjs'
import { message,Card,Input,Form,Modal,Table,Button, Select } from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {reqUserList, reqUserAdd, reqUserUpdate} from '../../api'
const {Item} = Form;
const {Option} = Select;

class User extends Component {
  state={
    operation:'add',
    userList:[],
    roleList:[],
    visible:false,
    _id:''
  }

  formRef = React.createRef();

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
      this.setState({userList:data.users.reverse(),roleList:data.roles})
    } else {
      message.error('获取用户信息失败',1)
    }
  }

  //“创建用户”按钮的onClick回调
  showAdd = ()=>{
    this.formRef.current.resetFields();//清空上一次的内容
    this.setState({operation:'add',visible:true});//显示Modal
  }
  //“修改”按钮的onClick回调
  showUpdate = (data)=>{
    this.formRef.current.setFieldsValue(data);//回显该条数据的内容
    this.setState({operation:'update',visible:true,_id:data._id});//保存待update的id
  }
  //Modal中确认按钮的onClick回调
  handleOk = ()=>{
    this.formRef.current.submit();
  }
  //Modal中取消按钮的onClick回调
  handleCancel = (values)=>{
    this.setState({visible:false})
  }

  //表单验证成功的回调
  onFinish = async (values)=>{
    console.log('values=',values)
    const {operation} = this.state;
    let response;
    //根据operation不同，发送添加/修改用户的请求
    if (operation === 'add') response = await reqUserAdd(values);
    else response = await reqUserUpdate({...values,_id:this.state._id});
    const {status,data,msg} = response;
    if(status === 0) {
      let userList = [...this.state.userList];
      console.log(userList)
      if (operation=== 'add') userList.unshift(data);//若是添加用户，则在userList的最前面添加数据
      else {//若是修改用户，则把userList中与修改的id匹配的user替换成返回的数据
        userList = userList.map((item)=>{
          if (item._id === this.state._id) return data;
          else return item;//注意这句 不更改也一定要返回！
        });
      }
      this.setState({visible:false,userList});//更新userList并关闭Modal
      message.success(`${operation==='add'?'添加':'修改'}用户${values.username}成功！`,1)
    } else {
      message.error(`${operation==='add'?'添加':'修改'}用户失败，${msg}`,1)
    }
  }

  //表单验证失败的回调
  onFinishFailed = ()=>{
    message.error('请检查输入',1);
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
        render:(time)=>dayjs(time).format('YYYY年MM月DD日 HH:mm:ss')
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
        render:(data)=>{return <Button type='link' onClick={()=>this.showUpdate(data)}>修改</Button>},
        // width: '25%',
        // align: 'center'
      },
    ];
    return (
      <div>
        <Card title={<Button type="primary" onClick={this.showAdd}><PlusOutlined />添加用户</Button>} >
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
            name="user_form"
            onFinish={this.onFinish} 
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
            labelCol={{span: 4 }}
            wrapperCol={{span: 16}}
          >
            <Item
              label='用户名'
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
                {
                  max: 12,
                  message:'用户名长度不可超过12位!'
                },
                {
                  min: 4,
                  message:'用户名长度不可少于4位!'
                },
                {
                  pattern:/^\w+$/,
                  message:'用户名只能由数字、字母、下划线组成!'
                },
              ]}
            >
              <Input placeholder="用户名" />
            </Item>
            {
              operation==='update'? undefined : 
              (<Item
                label='密码'
                name="password"
                rules={[{
                  required: true,
                  message: '密码不能为空!',
                },
                  {
                    validator:(rule, value, callback)=>{
                      try {
                        if (!(/^\w+$/.test(value))) {
                          return Promise.reject('密码只能由数字、字母、下划线组成！');
                        } else if (value.length < 4) {
                          return Promise.reject('密码不可少于4位！');
                        } else if (value.length > 12) {
                          return Promise.reject('密码不可超过12位！');
                        } 
                        return Promise.resolve();
                      } catch(err) {
                        callback(err);
                      }
                    }
                  },
                ]}//若是更新操作则不显示密码
              >
                <Input type="password" placeholder="密码"/>
              </Item>)
            }
            
            <Item
              label='手机号'
              name="phone"
              rules={[{
                required: true,
                message: '手机号不能为空!',
              },
                {
                  validator:(rule, value, callback)=>{
                    try {
                      if (!(/^\d{11}$/.test(value))) {
                        return Promise.reject('手机号只能由11位数字组成！');
                      } 
                      return Promise.resolve();
                    } catch(err) {
                      callback(err);
                    }
                  }
                },
              ]}
            >
              <Input placeholder="手机号"/>
            </Item>
            <Item
              label='邮箱'
              name="email"
              rules={[{
                required: true,
                message: '邮箱不能为空!',
              },
                {
                  validator:(rule, value, callback)=>{
                    try {
                      if (!(/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(value))) {
                        return Promise.reject('邮箱格式不正确！');
                      } 
                      return Promise.resolve();
                    } catch(err) {
                      callback(err);
                    }
                  }
                },
              ]}
            >
              <Input placeholder="邮箱"/>
            </Item>
            <Item 
              label='角色'
              name='role_id'
              rules={[{required:true,message:'请选择角色！'}]}
            >
              <Select defaultValue=''>
                <Option value=''>请选择角色</Option>
                {
                  roleList.map((item)=><Option value={item._id} key={item._id}>{item.name}</Option>)
                }
              </Select>
            </Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default User;