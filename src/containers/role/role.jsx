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

  addFormRef = React.createRef()

  componentDidMount() {
    this.getRoleList();
    this.setState({menuList:[{title:"全部权限",key:"top",children:menuList}]});
  }
  
  getRoleList = async ()=>{
    const {status, data} = await reqRoleList();
    if (status === 0) {
      this.setState({roleList:data});
    } else {
      message.error('获取角色列表失败',1)
    }
  }


  handleAddOk = () => {
    this.addFormRef.current.submit();
  };

  handleAuthOk = async ()=>{
    const {_id,checkedKeys} = this.state;
    const response = await reqRoleAuth({_id,menus:checkedKeys,auth_name:this.props.username});
    if (response.status === 0) {
      this.getRoleList();
      message.success('授权成功',1);
      this.setState({checkedKeys:[],visibleAuth:false});
    } else {
      message.error('授权失败',1);
    }
  }

  onAddFinish = async (values)=>{
    const {roleName} = values
    const response = await reqRoleAdd(roleName);
    const {status} = response;
    if (status === 0) {
      this.getRoleList();
      message.success(`添加角色${roleName}成功`,1)
      this.setState({visibleAdd:false});
    } else {
      message.error(`添加角色${roleName}失败`,1)
    }
  }
  onAddFinishFailed = ()=>{
    message.error('请检查输入')
  }

  showAuthModal = (_id)=>{
    this.setState({visibleAuth: true, _id});
    const role = this.state.roleList.find((item)=>item._id===_id);
    this.setState({checkedKeys:role.menus})
  }
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
          return <Button type='link' onClick={() => {this.showAuthModal(item._id)}}>设置权限</Button>
        },
        align:'center',
      }
    ];
      
      const onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({checkedKeys});
      };
    
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
          <Form ref={this.addFormRef} onFinish={this.onAddFinish} onFinishFailed={this.onAddFinishFailed}>
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
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
            defaultExpandAll
          />
        </Modal>
      </div>

    );
  }
}

export default Role;