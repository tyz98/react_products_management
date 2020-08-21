import React, { Component } from 'react';
import {connect} from 'react-redux'
import {Card,Table,Input,Button,Select,message} from 'antd'
import {PlusOutlined, SearchOutlined} from '@ant-design/icons'
import {createSaveProductsAction} from '../../redux/actions/product_action'
import {reqProductList,reqProductUpdateStatus,reqProductSearch} from '../../api'
import {PAGE_SIZE} from '../../config'
const { Option } = Select;
const { Search } = Input;

@connect(
  state=>({}),
  {saveProductList:createSaveProductsAction}
)
class Product extends Component {
  state={
    isLoading:true,
    productList:[],//保存本页展示的商品数据
    total:0,//保存总商品数或满足当前搜索条件的总商品数
    searchType:'productName',//搜索方式
    current:1,//当前亮起的页码
    // lastSearch:{},
  }

  componentDidMount() {
    this.getProductList(1);//初始化显示第一页的商品
  }

  //搜索Button onClick
  search = (value)=>{
    //这里isSearch和lastSearch直接挂在this上，放在state中state不能马上改变,进入getProductList中也读不出isSearch应该的值
    if (value==='') {
      this.isSearch=false;
      //req
      this.getProductList(1);
    } else {
      this.isSearch = true;
      //存储点击搜索框时的搜索类型和关键字
      this.lastSearch = {searchType:this.state.searchType,keyword:value};
      //req
      this.getProductList(1);
    }
  }

  //获取某页商品数据（全部数据/搜索数据）
  getProductList = async (pageNum)=>{
    this.setState({isLoading:true,current:pageNum});//请求前先显示loading，并把请求的页码亮起
    let response;
    //根据isSearch判断请求全部数据还是请求搜索数据
    if(!this.isSearch) {
      response = await reqProductList(pageNum,PAGE_SIZE);
    } else {
      //从this.lastSearch中读出点击搜索框时的搜索类型和关键字
      const {searchType,keyword} = this.lastSearch;
      response = await reqProductSearch(pageNum,PAGE_SIZE,searchType,keyword)
    }
    
    console.log('response=',response)
    const {status,data} = response;
    const {list,total} = data;
    this.setState({isLoading:false});//得到数据后取消loading
    if(status === 0) {
      //返回prouctList成功
      this.setState({productList:list,total});//更新状态中的本页商品列表和总商品数据
      this.props.saveProductList(list);//把本页商品列表存在redux中，方便查看详情时直接取本页数据匹配
    } else {
      //返回prouctList失败
      message.error('获取商品列表失败')
    }
  }

  //更新产品上架/上架
  updateProductStatus = async (productId,status)=>{
    const response = await reqProductUpdateStatus(productId,status);
    console.log('reponse=',response)
    if(response.status === 0) {
      //拷贝state中的productList,并更改相应数据的status
      let productList = [...this.state.productList];
      productList.forEach((item)=>{
        if(item._id === productId) {
          item.status = status;
        }
      });
      this.setState({productList});//更新状态
      message.success(`商品${status===1?'上架':'下架'}成功`);
    } else {
      message.error(`商品${status===1?'上架':'下架'}失败`);
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
        render:(p)=>'￥'+p,//加‘￥’
        align:'center',
      },
      {
        title: '状态',
        //dataIndex: 'status',
        key: 'status',
        render:(prod)=>{//根据status显示不同按钮和状态
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
        render:(item)=>{//编程式路由，点击详情/修改跳转，并携带参数
          return <div>
            <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button>
            <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
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
      extra={<Button type='primary' onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}>
              <PlusOutlined />添加商品
             </Button>}>
        <Table 
        dataSource={productList} 
        columns={columns} 
        rowKey='_id'
        loading={isLoading}
        bordered
        pagination={{current,total,pageSize:PAGE_SIZE,onChange:(currentPage)=>{this.getProductList(currentPage)}}}/>{/*点击页码时请求该页数据*/}
      </Card>
    );
  }
}

export default Product;