import React, { Component } from 'react';
import {Card, Button, Table, message, Modal, Form, Input} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {reqCategoryList,reqCategoryAdd,reqCategoryUpdate} from '../../api'

class Category extends Component {
  state={
    categoryArr:[],//存储所有类别信息的数组[{_id,name},..]
    visible:false,//Modal是否显示
    operation:'',//'add'/'update'
    isLoading:true,//数据没取回时isLaoding=true
    categoryToUpdate:{},//存储待修改的分类对象{_id,name}
  }

  componentDidMount() {
    //取category list显示
    console.log('category componentdidmount')
    this.getCategoryArr();
  }

  //取category list数据并更新状态
  getCategoryArr = async ()=>{
    console.log('getcategoryarr')
    let result = await reqCategoryList();
    console.log('set isLoading to false')
    this.setState({isLoading:false});//请求数据回来后即可关闭loading图标
    const {status,data,msg} = result;
    //根据响应数据的status属性判断请求list是否成功
    if (status === 0) {
      //由于服务端在新增分类时会往后加，而我们希望新增分类显示在第一个
      //所以我们在state.categoryArr中会把新增分类往前加
      //如果这里不reverse,刷新后重新取list显示时新增的就又会到后面去了
      console.log('set categoryArr')
      this.setState({categoryArr:data.reverse()});
      //console.log(data)
    } else {
      message.error(msg,1);
    }
  }

  //“添加” button onclick
  showAdd = () => {
    this.setState({
      visible: true, //Modal显示
      operation: 'add', //操作置为'add',方便后续onFinish时判断发什么请求
    });
  };

  //“修改分类” button onclick
  showUpdate = (data) => {
    console.log('shouwupdate,setstate')
    this.setState({
      visible: true,
      operation: 'update',
      categoryToUpdate:data
    });
    //上面这句setState之后没有立即render(),所以下面setFieldsValue时Modal还没出现
    //render()时机待研究！！！！！
    console.log('setfieldsvalue')
    //这一句在Modal出现之前就想用setFieldsValue设置Modal中的Form中的值，
    //所以要给Modal设置forceRender!!!!!!
    this.formRef.current.setFieldsValue({
      categoryName:data.name,
    });
    console.log('click update, change state')
  };

  //modal ok onclick
  handleOk = e => {
    //这里只做submit表单的操作，
    //如果表单验证成功会进入onFinish,失败会进入onFinishedFailed
    this.formRef.current.submit();
  };

  //modal cancel onclick
  handleCancel = e => {
    this.setState({
      visible: false,//关闭Modal
    });
    //reset form表单
    this.formRef.current.resetFields();
  };

  //创建ref，后面写在Form里
  formRef = React.createRef();

  //表单验证失败
  onFinishFailed = (value)=>{
    console.log('onFinishFailed',value)
    message.error('表单输入有误，请修改后提交！',1)
  }
  //表单验证成功
  onFinish = (value)=>{
    console.log('onFinish,数据为',value)
    let {categoryName} = value
    //根据operation对输入的categoryName做相应操作
    if(this.state.operation === 'add') {
      this.add(categoryName)
    } else if (this.state.operation === 'update') {
      this.update(this.state.categoryToUpdate._id, categoryName);
    }
  }

  update = async (categoryId, categoryName)=>{
    //这里必须用[...]来取，之后修改再setState，不能修改原来的,否则不能render()
    let categoryArr = [...this.state.categoryArr];
    //发送update请求并得到响应
    let response = await reqCategoryUpdate(categoryId, categoryName);
    const {status} = response;
    if (status === 0) {
      //如果服务器中修改成功，我们也要修改状态中的categoryArr更新界面
      categoryArr.forEach((item)=>{
        if (item._id === categoryId) {
          item.name=categoryName;
        }
      });
      //把修改后的categoryArr维护到状态中
      //并关闭Modal
      this.setState({categoryArr,visible: false}); 
      message.success(`修改分类为${categoryName}成功`)
      //reset form表单
      this.formRef.current.resetFields();
    } else {
      message.error(`修改分类失败`);
      //修改失败时不reset表单也不关闭modal(为了方便用户继续尝试)
    }
  }

  add = async (categoryName)=>{//整体逻辑与update类似
    //这里必须用[...]来取，之后修改再setState，不能修改原来的,否则不能render()
    let categoryArr = [...this.state.categoryArr];
    //发送add请求并得到响应
    let response = await reqCategoryAdd(categoryName);
    const {status,data,msg} = response;
    if (status === 0) {
      //添加
      categoryArr.unshift(data);
      //把修改后的categoryArr维护到状态中
      //并关闭Modal
      this.setState({categoryArr,visible: false}); 
      message.success(`添加分类${categoryName}成功`)
      //reset form表单
      this.formRef.current.resetFields();
    } else {
      message.error(`添加分类${categoryName}失败，${msg}`);
      //修改失败时不reset表单也不关闭modal(为了方便用户继续尝试)
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
        //dataIndex: 'name',//不指定的dataIndex的话，下面render()中传入的data就是整个数据对象
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