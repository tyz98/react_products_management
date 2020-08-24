import React, { Component } from 'react';
import {Button, Card, Table, Modal, Input, Form, message,Tree} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import {reqRoleList, reqRoleAdd} from '../../api'
const {Item} = Form;

class Role extends Component {
  state = { 
    visibleAdd: false,
    visibleAuth: false,
    roleList:[],
    expandedKeys:[],
    checkedKeys:[],
    autoExpandParent:true
  };

  addFormRef = React.createRef()

  componentDidMount() {
    this.getRoleList();
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

  handleAddCancel = e => {
    console.log(e);
    this.setState({
      visibleAdd: false,
    });
  };

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

  render() {
    const {roleList,expandedKeys,checkedKeys,selectedKeys,autoExpandParent,visibleAdd,visibleAuth} = this.state;
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
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
        render:(time)=>time ? (time)=> dayjs(time).format('YYYY年MM月DD日 HH:mm:ss') : '' //如果无auth_time则显示空字符串，否则会传入undefined,dayjs()默认读取当前时间
      },
      {
        title: '操作',
        key:'operation',
        render:(item)=>{
          return <Button type='link' onClick={() => {this.setState({visibleAuth: true,})}}>设置权限</Button>
        },
        align:'center',
      }
    ];
    const treeData = [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0',
            children: [
              {
                title: '0-0-0-0',
                key: '0-0-0-0',
              },
              {
                title: '0-0-0-1',
                key: '0-0-0-1',
              },
              {
                title: '0-0-0-2',
                key: '0-0-0-2',
              },
            ],
          },
          {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              {
                title: '0-0-1-0',
                key: '0-0-1-0',
              },
              {
                title: '0-0-1-1',
                key: '0-0-1-1',
              },
              {
                title: '0-0-1-2',
                key: '0-0-1-2',
              },
            ],
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
        children: [
          {
            title: '0-1-0-0',
            key: '0-1-0-0',
          },
          {
            title: '0-1-0-1',
            key: '0-1-0-1',
          },
          {
            title: '0-1-0-2',
            key: '0-1-0-2',
          },
        ],
      },
      {
        title: '0-2',
        key: '0-2',
      },
    ];
    
      // const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
      // const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
      // const [selectedKeys, setSelectedKeys] = useState([]);
      // const [autoExpandParent, setAutoExpandParent] = useState(true);

      const onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({expandedKeys});
        this.setState({autoExpandParent:false});
      };
    
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
          />{/*点击页码时请求该页数据*/}
        </Card>
        <Modal
          title="新增角色"
          visible={visibleAdd}
          onOk={this.handleAddOk}
          onCancel={this.handleAddCancel}
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
          onCancel={this.handleAuthCancel}
          forceRender
        >
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
          />
        </Modal>
      </div>

    );
  }
}

export default Role;