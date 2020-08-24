import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Card, Button, Form, Input, Select, message } from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons'
import {reqCategoryList,reqProductAdd, reqProductInfo} from '../../api'
import PicturesWall from './pictures_wall'
import RichTextEditor from './rich_text_editor'
const {Item} = Form;
const {Option} = Select;

@connect(
  state=>({categories:state.categories,products:state.products}),
  {}
)
class AddUpdate extends Component {

  picturesRef = React.createRef();
  richTextRef = React.createRef();
  formRef = React.createRef();

  state={
    categories:[],
    isLoading:true,
    operation:'add',
    name:'',
    price:'',
    categoryId:'',
    imgs:[],
    desc:'',
    detail:''
  }


  componentDidMount() {
    console.log('componentDidMount addupdate')
    console.log('this.picturesRef',this.picturesRef)
    console.log('this.formRef',this.formRef)
    this.picturesRefCallback();
    console.log('this.richTextRef',this.richTextRef)
    if (this.props.match.params.id) {//如果参数中带有id，则说明是修改操作
      this.id = this.props.match.params.id;
      this.setState({operation:'update'})
      if (this.props.products.length) {//如果redux中已经保存了本页商品信息，则直接从redux中匹配id并取得该商品信息到state中
        const product = this.props.products.find((item)=>item._id === this.id);
        const {name,price,categoryId,imgs,desc,detail} = product;
        this.categoryId = categoryId;//把categoryId直接挂在this上，方便下面匹配categoryName（若下面直接取state中的categoryId取不到，因为下一行的setState不会立即生效）
        this.formRef.current.setFieldsValue({name,price,categoryId,desc,detail});//设置初始值
        this.setState({name,price,categoryId,imgs,desc,detail}); 
        this.picturesRef.current.setFileList(imgs);//展示imgs初始值  
        this.richTextRef.current.setRichText(detail);//展示富文本编辑器初始值
      } else {//如果redux中没有保存本页商品信息，则从服务器中获取
        this.reqProductFromServer();
      }
    }
    const {categories} = this.props;
    if(categories.length) {//如果redux中存过categories(证明查看过分类管理页面)，直接从redux中取出categories，匹配id得到categoryName
      this.setState({categories,isLoading:false});
    } else {
      this.reqCategoriesFromServer();
    }

    console.log('componentDidMount end, state=',this.state)
  }

    //根据id从服务器得到与id匹配的产品信息并更新state
    reqProductFromServer = async ()=>{
      const response = await reqProductInfo(this.id);//地址栏带过来的参数this.props.match.params.id
      if (response.status === 0) {
        const {name,price,categoryId,imgs,desc,detail} = response.data;
        this.categoryId = categoryId;//把categoryId直接挂在this上，方便下面匹配categoryName（若下面直接取state中的categoryId取不到，因为下一行的setState不会立即生效）
        this.setState({name,price,categoryId,imgs,desc,detail});      
        this.picturesRef.current.setFileList(imgs);//展示imgs初始值      
        this.formRef.current.setFieldsValue({name,price,categoryId,desc,detail});//设置初始值
        this.richTextRef.current.setRichText(detail);//展示富文本编辑器初始值
        console.log('state=',this.state)
      } else {
        message.error('获取商品详情失败',1)
      }
    }

  reqCategoriesFromServer = async ()=>{
    const response = await reqCategoryList();
    if (response.status === 0) {
      const categories = response.data;
      this.setState({categories,isLoading:false});
    } else {
      message.error('获取商品类别名称失败',1)
    }
  }



  onFinish = async (values)=>{
    //使用ref获得pictureswall上的方法，得到所有图片名(父组件要使用子组件的方法，可用ref！！！不能把方法放到redux中)
    const imgs = this.picturesRef.current.getImgNames();
    const detail = this.richTextRef.current.getRichText();
    const response = await reqProductAdd({...values,imgs,detail});
    const {status,msg} = response;
    if (status === 0) {
      message.success('添加商品成功',1);
      //添加成功则回到商品管理页面
      this.props.history.replace('/admin/prod_about/product')
    } else {
      message.error('添加商品失败,'+msg,1);
    }
  }


  onFinishFailed = errorInfo => {
    message.error('表单验证失败，请检查输入',1);
  };

  picturesRefCallback = ref =>{
    console.log('ref=',ref)
  }
  render() {
    console.log('in render(), state=',this.state);
    const title = <div>
                    <Button type='link' size='small' onClick={()=>{this.props.history.goBack()}}>
                      <ArrowLeftOutlined/>
                    </Button>
                    商品添加
                  </div>
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    const tailLayout = {
      wrapperCol: { offset: 6},
    };

    const {categories,isLoading} = this.state;
    return (
      <Card title={title} >
        <Form {...layout}  onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} ref={this.formRef}>
          <Item label="商品名称" name='name' rules={[{required:true,message:'商品名称不能为空'}]}>
            <Input placeholder="商品名称" />
          </Item>
          <Item label="商品描述" name='desc' rules={[{required:true,message:'商品描述不能为空'}]}>
            <Input placeholder="商品描述"/>
          </Item>
          <Item label="商品价格" name='price' rules={[{required:true,message:'商品价格不能为空'}]}>
            <Input type="number" placeholder="商品价格"  prefix='￥' addonAfter='元'/>
          </Item>
          <Item label="商品分类" name='categoryId' rules={[{required:true,message:'商品描述不能为空'}]}>
            <Select initialvalue="">
              <Option value='' key='not-select'>请选择分类</Option>
              {
                categories.map((item)=>{
                  return <Option value={item._id} key={item._id}>{item.name}</Option>
                })
              }
            </Select>
          </Item>
          <Item label="商品图片" name='imgs'>
            {/**antd中加ref，与之前用React.createRef建立的属性关联，用那个属性就可以使用这个实例中定义的方法 */}
            <PicturesWall ref={this.picturesRef}/>
          </Item>
          <Item label="商品详情" name='detail' wrapperCol={{ span: 12 }}>
            <RichTextEditor ref={this.richTextRef}/>
          </Item>
          <Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
        </Item>
        </Form>
        <div>
          {this.state.desc}
        </div>
      </Card>
    )
  }
}

export default AddUpdate;
