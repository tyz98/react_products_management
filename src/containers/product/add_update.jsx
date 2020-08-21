import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Card, Button, Form, Input, Select, message } from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons'
import {reqCategoryList,reqProductAdd} from '../../api'
import PicturesWall from './pictures_wall'
const {Item} = Form;
const {Option} = Select;

@connect(
  state=>({categories:state.categories}),
  {}
)
class AddUpdate extends Component {
  state={
    categories:[],
    isLoading:true,
  }

  //ref
  picturesRef = React.createRef();

  componentDidMount() {
    const {categories} = this.props;
    if(categories.length) {//如果redux中存过categories(证明查看过分类管理页面)，直接从redux中取出categories，匹配id得到categoryName
      this.setState({categories,isLoading:false});
    } else {
      this.reqCategoriesFromServer();
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
    console.log('this.picturesRef',this.picturesRef)
    //使用ref获得pictureswall上的方法，得到所有图片名(父组件要使用子组件的方法，可用ref！！！不能把方法放到redux中)
    const imgs = this.picturesRef.current.getImgNames();
    const response = await reqProductAdd({...values,imgs});
    const {status,msg} = response;
    if (status === 0) {
      message.success('添加商品成功',1);
    } else {
      message.error('添加商品失败,'+msg,1);
    }
  }


  onFinishFailed = errorInfo => {
    message.error('表单验证失败，请检查输入',1);
  };

  render() {
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
      <Card title={title} loading={isLoading}>
        <Form {...layout}  onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
          <Item label="商品名称" name='name' rules={[{required:true,message:'商品名称不能为空'}]}>
            <Input placeholder="商品名称"/>
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
          <Item label="商品详情" name='detail'>
            富文本编辑器
          </Item>
          <Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
        </Item>
        </Form>
      </Card>
    )
  }
}

export default AddUpdate;
