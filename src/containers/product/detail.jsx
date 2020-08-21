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
  state={//state中保存要展示的信息
    name:'',
    price:'',
    categoryId:'',
    imgs:[],
    desc:''
  }

  //判断以何种方式取得详情并直接更新状态或发请求
  componentDidMount() {
    const {products} = this.props;
    console.log(products)
    //如果products不是空数组，说明是由商品页点击详情进入的，有商品信息已经存在redux中
    if (products.length !== 0){
      const product = products.find((item)=>{return item._id===this.props.match.params.id})
      const {name,price,categoryId,imgs,desc} = product;
      this.setState({name,price,categoryId,imgs,desc});//更新状态
    } else {//如果products是空数组，说明是由地址栏直接进入的，应向服务器发请求得到商品详情信息
      this.reqProductFromServer();//根据id从服务器得到详情信息并更新状态
    }
  }

  //根据id从服务器得到详情信息并更新状态
  reqProductFromServer = async ()=>{
    const response = await reqProductInfo(this.props.match.params.id);//地址栏带过来的参数this.props.match.params.id
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
