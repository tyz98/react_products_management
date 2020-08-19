import React, { Component } from 'react';
import {Card, Button, Table, message, Modal, Form, Input} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {reqCategoryList} from '../../api'

class Category extends Component {
  state={
    categoryArr:[],
    visible:false,
    operation:'',
  }

  formRef = React.createRef();

  componentDidMount() {
    this.getCategoryArr();
  }

  //get category list to show
  getCategoryArr = async ()=>{
    let result = await reqCategoryList();
    const {status,data,msg} = result;
    if (status === 0) {
      this.setState({categoryArr:data});
    } else {
      message.error(msg,1);
    }
  }

  //“添加” button onclick
  showAdd = () => {
    this.setState({
      visible: true,
      operation: 'add',
    });
  };

  //“修改分类” button onclick
  showUpdate = () => {
    this.setState({
      visible: true,
      operation: 'update'
    });
  };

  //modal ok onclick
  handleOk = e => {
    this.setState({
      visible: false,
    });
    //reset form
    this.formRef.current.resetFields();
  };

  //modal cancel onclick
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
    //reset form
    this.formRef.current.resetFields();
  };
  render() {
    let {visible,operation,categoryArr} = this.state;

    const dataSource = categoryArr;
    
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        dataIndex: 'name',
        key: 'operation',
        render:(name)=>{return <Button type='link' onClick={this.showUpdate}>修改分类</Button>},
        width: '25%',
        align: 'center'
      },
    ];
    
    return (
      <div>
        <Card extra={<Button type="primary" onClick={this.showAdd}><PlusOutlined />添加</Button>} >
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            bordered={true} 
            rowKey='_id' 
            pagination={{pageSize:5}}
          />
        </Card>
        <Modal
          title={operation === 'add' ? "添加分类":"修改分类"}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
        >
          <Form
            name="category-modify"
            ref={this.formRef}
            //initialValues={{ category_name: '' }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
              <Form.Item
                name="category_name"
                rules={[{ required: true, message: '分类名不能为空!' }]}
              >
                <Input placeholder="请输入分类名"/>
              </Form.Item>
            </Form>
        </Modal>
      </div>
    );
  }
}

export default Category;