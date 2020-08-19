import React, { Component } from 'react';
import {Card, Button, Table, message, Modal, Form, Input} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {reqCategoryList,reqCategoryAdd,reqCategoryUpdate} from '../../api'

class Category extends Component {
  state={
    categoryArr:[],
    visible:false,
    operation:'',
    isLoading:true,
    categoryToUpdate:{},
  }

  componentDidMount() {
    this.getCategoryArr();
  }

  //get category list to show
  getCategoryArr = async ()=>{
    let result = await reqCategoryList();
    this.setState({isLoading:false})
    const {status,data,msg} = result;
    if (status === 0) {
      this.setState({categoryArr:data.reverse()});
      //console.log(data)
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
  showUpdate = (data) => {
    //this.formRef.current.setFieldsValue({categoryName:data.categoryName});
    this.setState({
      visible: true,
      operation: 'update',
      categoryToUpdate:data
    });
    //这一句在Modal出现之前就想用setFieldsValue设置Modal中的Form中的值，要给Modal设置forceRender!!!!!!
    this.formRef.current.setFieldsValue({
      categoryName:data.name,
    });
    console.log('click update, change state')
  };

  //modal ok onclick
  handleOk = e => {
    //submit form
    this.formRef.current.submit();
  };

  //modal cancel onclick
  handleCancel = e => {
    this.setState({
      visible: false,
    });
    //reset form
    this.formRef.current.resetFields();
  };

  formRef = React.createRef();

  onFinishFailed = (value)=>{
    console.log('onFinishFailed',value)
    message.error('表单输入有误，请修改后提交！',1)
  }

  onFinish = (value)=>{
    console.log('onFinish,数据为',value)
    let {categoryName} = value
    //let categoryArr = this.state.categoryArr;
    if(this.state.operation === 'add') {
      this.add(categoryName)
    } else if (this.state.operation === 'update') {
      this.update(this.state.categoryToUpdate._id, categoryName);
    }
  }

  update = async (categoryId, categoryName)=>{
    let categoryArr = [...this.state.categoryArr];
    let response = await reqCategoryUpdate(categoryId, categoryName);
    const {status,msg} = response;
    if (status === 0) {
      categoryArr.forEach((item)=>{
        if (item._id === categoryId) {
          item.name=categoryName;
        }
      });
      //set new categoryArr and close modal
      this.setState({categoryArr,visible: false}); 
      message.success(`修改分类为${categoryName}成功`)
      //reset form
      this.formRef.current.resetFields();
    } else {
      message.error(`修改分类失败`);
      //do not reset form and do not close modal
    }
  }

  add = async (categoryName)=>{
    let categoryArr = [...this.state.categoryArr];
    let response = await reqCategoryAdd(categoryName);
    const {status,data,msg} = response;
    if (status === 0) {
      //add to state
      categoryArr.unshift(data);
      //set new categoryArr and close modal
      this.setState({categoryArr,visible: false}); 
      message.success(`添加分类${categoryName}成功`)
      //reset form
      this.formRef.current.resetFields();
    } else {
      message.error(`添加分类${categoryName}失败，${msg}`);
      //do not reset form and do not close modal
    }
  }


  render() {
    console.log('render() category')
    let {visible,operation,categoryArr,isLoading} = this.state;
    const dataSource = categoryArr;
    
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        //dataIndex: 'name',
        key: 'operation',
        render:(data)=>{return <Button type='link' onClick={()=>{this.showUpdate(data)}}>修改分类</Button>},
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
            pagination={{pageSize:5,showQuickJumper:true}}
            loading={isLoading}
          />
        </Card>
        <Modal
          title={operation === 'add' ? "添加分类":"修改分类"}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
          forceRender
        >
          <Form
            name="categoryModify"
            ref={this.formRef}
            //initialValues={operation === 'update' ? { categoryName: modalValue}:{}}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
              <Form.Item
                name="categoryName"
                rules={[{ required: true, message: '分类名不能为空!' }]}
                //initialValue={this.state.modalValue}
              >
                <Input placeholder="请输入分类名" />
              </Form.Item>
            </Form>
        </Modal>
      </div>
    );
  }
}

export default Category;