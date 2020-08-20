import React, { Component } from 'react';
import {Card,Table,Input,Button,Select,message} from 'antd'
import {PlusOutlined, SearchOutlined} from '@ant-design/icons'
import {reqProductList,reqProductUpdateStatus,reqProductSearch} from '../../api'
import {PAGE_SIZE} from '../../config'
const { Option } = Select;
const { Search } = Input;

class Product extends Component {
  state={
    isLoading:true,
    productList:[],
    total:0,
    searchType:'productName',
    // lastSearch:{},
  }
  componentDidMount() {
    this.getProductList(1);
  }

  getProductList = async (pageNum)=>{
    this.setState({isLoading:true,current:pageNum});
    let response;
    if(!this.isSearch) {
      console.log('not search')
      response = await reqProductList(pageNum,PAGE_SIZE);
    } else {
      console.log('issearch')
      const {searchType,keyword} = this.lastSearch;
      response = await reqProductSearch(pageNum,PAGE_SIZE,searchType,keyword)
    }
    
    console.log('response=',response)
    const {status,data} = response;
    const {list,total} = data;
    this.setState({isLoading:false})
    if(status === 0) {
      //返回prouctList成功
      this.setState({productList:list,total});
    } else {
      message.error('获取商品列表失败')
    }
  }

  updateProductStatus = async (productId,status)=>{
    const response = await reqProductUpdateStatus(productId,status);
    console.log('reponse=',response)
    if(response.status === 0) {
      let productList = [...this.state.productList];
      productList.forEach((item)=>{
        if(item._id === productId) {
          item.status = status;
        }
      });
      this.setState({productList});
      message.success(`商品${status===1?'上架':'下架'}成功`);
    } else {
      message.error(`商品${status===1?'上架':'下架'}失败`);
    }
  }

  search = (value)=>{
    if (value==='') {
      this.isSearch=false;
      this.getProductList(1);
    } else {
      this.isSearch = true;
      this.lastSearch = {searchType:this.state.searchType,keyword:value};
      console.log('lastsearch',this.lastSearch)
      //this.setState({lastSearch});
      this.getProductList(1);
    }
  }

  render() {
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render:(p)=>'￥'+p,
        align:'center',
      },
      {
        title: '状态',
        //dataIndex: 'status',
        key: 'status',
        render:(prod)=>{
            const {_id,status} = prod;
            return <div>
                    <Button 
                    type={status===1?'primary':'danger'}
                    onClick={()=>{this.updateProductStatus(_id,status===1?2:1)}}>
                      {status===1?'下架':'上架'}
                    </Button>
                    <div>{status===1?'在售':'已下架'}</div>
                  </div>

        },
        align:'center',
      },
      {
        title: '操作',
        key:'operation',
        render:()=>{
          return <div>
            <Button type='link'>详情</Button>
            <Button type='link'>修改</Button>
          </div>
        },
        align:'center',
      }
    ];
    
    const {isLoading,productList,total,current} = this.state;
    
    return (
      <Card 
      title={<div>
              <Select defaultValue="productName" style={{ width: '20%' }}
                      onChange={(value)=>{this.setState({searchType:value})}}>
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
              </Select>
              <Search
                placeholder="关键字"
                enterButton={<span><SearchOutlined/> 搜索</span>}
                allowClear
                onSearch={this.search}
                style={{width:'40%', margin:'0 15px'}}
              />
              {/* <Input placeholder='关键字' allowClear style={{ margin:'0 20px',width:'30%' }}/>
              <Button type='primary' onClick={this.search}><SearchOutlined/>搜索</Button> */}
            </div>} 
      extra={<Button type='primary' >
              <PlusOutlined />添加商品
             </Button>}>
        <Table 
        dataSource={productList} 
        columns={columns} 
        rowKey='_id'
        loading={isLoading}
        bordered
        pagination={{current,total,pageSize:PAGE_SIZE,onChange:(currentPage)=>{this.getProductList(currentPage)}}}/>
      </Card>
    );
  }
}

export default Product;