import React, { Component } from 'react'
import {connect} from 'react-redux'
import {List,Button, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {reqProductInfo,reqCategoryList} from '../../api'
import './css/detail.less'
const {Item} = List

@connect(
  state=>({products:state.products,categories:state.categories}),
  {}
)
class Detail extends Component {
  state={//state中保存要展示的信息
    name:'',
    price:'',
    categoryId:'',
    categoryName:'',
    imgs:[],
    desc:'',
    isLoading:true,
  }

  //判断以何种方式取得详情并直接更新状态或发请求
  componentDidMount() {
    console.log('isLoading=',this.state.isLoading)
    const {products,categories} = this.props;
    console.log(products)
    //如果products不是空数组，说明是由商品页点击详情进入的，有商品信息已经存在redux中
    if (products.length){
      const product = products.find((item)=>{return item._id===this.props.match.params.id})
      const {name,price,categoryId,imgs,desc} = product;
      this.categoryId = categoryId;//把categoryId直接挂在this上，方便下面匹配categoryName（若下面直接取state中的categoryId取不到，因为下一行的setState不会立即生效）
      this.setState({name,price,categoryId,imgs,desc});//更新状态
    } else {//如果products是空数组，说明是由地址栏直接进入的，应向服务器发请求得到商品详情信息
      this.reqProductFromServer();//根据id从服务器得到详情信息并更新状态
    }
    if(categories.length) {//如果redux中存过categories(证明查看过分类管理页面)，直接从redux中取出categories，匹配id得到categoryName
      const category = categories.find((item)=>item._id === this.categoryId)//若直接取state中的categoryId取不到，因为上面的setState不会立即生效
      this.setState({categoryName:category.name,isLoading:false});
    } else {
      this.reqCategoriesFromServer();
    }
  }

  //根据id从服务器得到详情信息并更新状态
  reqProductFromServer = async ()=>{
    const response = await reqProductInfo(this.props.match.params.id);//地址栏带过来的参数this.props.match.params.id
    if (response.status === 0) {
      const {name,price,categoryId,imgs,desc} = response.data;
      this.categoryId = categoryId;//把categoryId直接挂在this上，方便下面匹配categoryName（若下面直接取state中的categoryId取不到，因为下一行的setState不会立即生效）
      this.setState({name,price,categoryId,imgs,desc});
    } else {
      message.error('获取商品详情失败',1)
    }
  }

  reqCategoriesFromServer = async ()=>{
    const response = await reqCategoryList();
    if (response.status === 0) {
      const categories = response.data;
      const category = categories.find((item)=>item._id === this.categoryId)//若直接取state中的categoryId取不到，因为上面的setState不会立即生效
      if (category) this.setState({categoryName:category.name,isLoading:false});
      else message.error('获取商品类别名称失败',1)
    } else {
      message.error('获取商品类别名称失败',1)
    }
  }

  render() {
    console.log('productLIST=',this.props.productList);
    console.log('render() detail isLoading=',this.state.isLoading);
    return (
      <List
        header={<div className='detail-header'>
                  <Button type='link' size='small' onClick={()=>{this.props.history.goBack()}}>
                    <ArrowLeftOutlined/>
                  </Button>
                  商品详情
                </div>}
        bordered
        className='detail-list'
        loading={this.state.isLoading}
      >
        <Item>
          <span className='detail-title'>商品名称：</span>{this.state.name}
        </Item>
        <Item>
          <span className='detail-title'>商品价格：</span>{`￥${this.state.price}`}
        </Item>
        <Item>
          <span className='detail-title'>商品分类：</span>{this.state.categoryName}
        </Item>
        <Item style={{'justify-content':'flex-start'}}>
          <span className='detail-title'>商品图片：</span>
          {
            this.state.imgs.map((item=>{
              return <img src={'/upload/'+item} alt="商品图片" style={{width:'150px'}}/>
            }))
          }
        </Item>
        <Item>
          <span className='detail-title'>商品描述：</span>{this.state.desc}
        </Item>
      </List>
    )
  }
}

export default Detail
