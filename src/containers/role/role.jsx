import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Button, Card, Table, Modal, Input, Form, message,Tree} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import {reqRoleList, reqRoleAdd, reqRoleAuth} from '../../api'
import menuList from '../../config/menu-config'
const {Item} = Form;

@connect(
  state=>({username:state.userInfo.user.username}),
  {}
)
class Role extends Component {
  state = { 
    visibleAdd: false,
    visibleAuth: false,
    roleList:[],
    checkedKeys:[],
    menuList,
    _id:'',
  };

  addFormRef = React.createRef();

  componentDidMount() {
    this.getRoleList();//请求角色列表，并保存到状态roleList
    this.setState({menuList:[{title:"全部权限",key:"top",children:menuList}]});//把menuList维护到状态，并在最外层加最高权限
  }
  
  //请求角色列表，并保存到状态roleList
  getRoleList = async ()=>{
    const {status, data} = await reqRoleList();
    if (status === 0) {
      this.setState({roleList:data});
    } else {
      message.error('获取角色列表失败',1)
    }
  }

  //添加角色Modal中Form的确认onClick回调
  handleAddOk = () => {
    this.addFormRef.current.submit();//提交表单
  };
  //添加角色的表单验证成功的回调
  onAddFinish = async (values)=>{
    const {roleName} = values
    const response = await reqRoleAdd(roleName);//发送添加角色的请求
    const {status} = response;
    if (status === 0) {
      this.getRoleList();//更新显示的角色列表
      message.success(`添加角色${roleName}成功`,1)
      this.setState({visibleAdd:false});//关闭Modal
    } else {
      message.error(`添加角色${roleName}失败`,1)
    }
  }

  //"设置权限"的onClick回调
  showAuthModal = (_id)=>{
    this.setState({visibleAuth: true, _id});//显示Modal,并用正在操作的角色的_id更新状态
    const role = this.state.roleList.find((item)=>item._id===_id);//从roleList中找到那一个匹配_id的role
    this.setState({checkedKeys:role.menus});//把menus中的check
  }

  
  //设置权限Modal的确认onClick回调
  handleAuthOk = async ()=>{
    const {_id,checkedKeys} = this.state;
    const response = await reqRoleAuth({_id,menus:checkedKeys,auth_name:this.props.username});//设置权限的请求
    if (response.status === 0) {
      this.getRoleList();//更新角色列表
      message.success('授权成功',1);
      this.setState({checkedKeys:[],visibleAuth:false});//清除checked，关闭Modal
    } else {
      message.error('授权失败',1);
    }
  }

  //每次check发生变化即更新状态（受控）
  onCheck = checkedKeys => {
    //console.log('onCheck', checkedKeys);
    this.setState({checkedKeys});
  };

  render() {
    const {roleList,checkedKeys,visibleAdd,visibleAuth,menuList} = this.state;
    console.log('roleList',roleList)
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render:(time)=> dayjs(time).format('YYYY年MM月DD日 HH:mm:ss')
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render:(time)=> time ? dayjs(time).format('YYYY年MM月DD日 HH:mm:ss') : ''//如果无auth_time则显示空字符串，否则会传入undefined,dayjs()默认读取当前时间
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
        key:'operation',
        render:(item)=>{
          return <Button type='link' onClick={() => {this.showAuthModal(item._id)}}>设置权限</Button>//onclick要传入当前操作的id
        },
        align:'center',
      }
    ];
    
    return (
      <div>
        <Card 
        title={<Button type="primary" onClick={() => {this.setState({visibleAdd: true,})}}>
                <PlusOutlined/>新增角色
                </Button>} >
          <Table 
          dataSource={roleList} 
          columns={columns} 
          rowKey='_id'
          bordered
          pagination={{pageSize:5,showQuickJumper:true}}
          />
        </Card>
        <Modal
          title="新增角色"
          visible={visibleAdd}
          onOk={this.handleAddOk}
          onCancel={() => {this.setState({visibleAdd: false})}}
          forceRender
        >
          {/* 需要addFormRef来提交表单 */}
          <Form ref={this.addFormRef} onFinish={this.onAddFinish} onFinishFailed={()=>{message.error('请检查输入',1)}}>
            <Item name='roleName' rules={[{required:true, message:"角色名不能为空！"}]}>
              <Input placeholder='请输入角色名' ></Input>
            </Item>
          </Form>
        </Modal>
        <Modal
          title="权限管理"
          visible={visibleAuth}
          onOk={this.handleAuthOk}
          onCancel={() => {this.setState({visibleAuth: false})}}
          forceRender
        >
          <Tree
            checkable
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
            defaultExpandAll//默认打开所有父节点
          />
        </Modal>
      </div>

    );
  }
}

export default Role;