import React, { Component } from 'react';
import {Card, Button, Table, message} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {reqCategoryList} from '../../api'

class Category extends Component {
  state={
    categoryArr:[]
  }
  modify = (categoryName)=>{
    console.log(categoryName);
  }

  getCategoryArr = async ()=>{
    let result = await reqCategoryList();
    const {status,data,msg} = result;
    if (status === 0) {
      this.setState({categoryArr:data});
    } else {
      message.error(msg,1);
    }
  }
  componentDidMount() {
    this.getCategoryArr();
  }
  render() {
    const dataSource = this.state.categoryArr;
    
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
        render:(name)=>{return <Button type='link' onClick={()=>{this.modify(name)}}>修改分类</Button>},
        width: '25%',
        align: 'center'
      },
    ];
    
    return (
      <Card extra={<Button type="primary"><PlusOutlined />添加</Button>} >
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          bordered={true} 
          rowKey='_id' 
          pagination={{pageSize:5}}
        />
      </Card>
    );
  }
}

export default Category;