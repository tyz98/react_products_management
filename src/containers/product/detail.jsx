import React, { Component } from 'react'
import {connect} from 'react-redux'
import {List,Button, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {reqProductInfo} from '../../api'
import './css/detail.less'
const {Item} = List

@connect(
  state=>({products:state.products}),
  {}
)
class Detail extends Component {
  state={
    name:'',
    price:'',
    categoryId:'',
    imgs:[],
    desc:''
  }
  componentDidMount() {
    const {products} = this.props;
    console.log('products=',products)
    // debugger
    console.log(products)
    if (products.length !== 0){
      const product = products.find((item)=>{return item._id===this.props.match.params.id})
      const {name,price,categoryId,imgs,desc} = product;
      this.setState({name,price,categoryId,imgs,desc});
    } else {
      this.reqProductFromServer();
    }
  }

  reqProductFromServer = async ()=>{
    const response = await reqProductInfo(this.props.match.params.id);
    if (response.status === 0) {
      const {name,price,categoryId,imgs,desc} = response.data;
      this.setState({name,price,categoryId,imgs,desc});
    } else {
      message.error('获取商品详情失败',1)
    }
  }
  render() {
    console.log('productLIST=',this.props.productList);
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
      >
        <Item>
          <span className='detail-title'>商品名称：</span>{this.state.name}
        </Item>
        <Item>
          <span className='detail-title'>商品价格：</span>{`￥${this.state.price}`}
        </Item>
        <Item>
          <span className='detail-title'>商品分类：</span>{this.state.categoryId}
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
