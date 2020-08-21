import React,{Component} from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../config'
import {reqPictureDelete} from '../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  state = {
    previewVisible: false,//预览框是否可见
    previewImage: '',//预览框图片（url或base64）
    previewTitle: '',//预览框标题
    fileList: [],
  };

  //关闭预览框时的回调
  handleCancel = () => this.setState({ previewVisible: false });//Modal不可见

  //点击预览时的回调
  handlePreview = async file => {
    if (!file.url && !file.preview) {//如果没有url也没有base64,则添加一个base64
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,//优先用url
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //上传文件状态改变时的回调，上传中、完成、失败、删除都会调用这个函数。
  handleChange = ({ file, fileList }) => {
    console.log('file=',file)
    const {response,status} = file;
    //上传
    if(status==='done') {//这里只是页面上上传成功
      if (response.status === 0) {//这里才是在服务器中上传成功上传成功要在新增的file上加url和name属性（服务器中的url和name）
        //这里不能把fileList[fileList.length - 1]改成file，file是一份拷贝，给file加属性影响不到fileList中新增的那个file
        fileList[fileList.length - 1].url= response.data.url;
        fileList[fileList.length - 1].name = response.data.name;
      } else {
        message.error(response.msg,1)
      }
    }
    if(status==='removed') {//这里只是页面上删除成功
      //要在这里根据删除的file的信息真正发请求删除服务器中的图片
      this.deleteImg(file.name);
    }
    this.setState({ fileList });//状态改变时，更新fileList,照片墙重新render
  }

  deleteImg = async (name)=>{
    const response = await reqPictureDelete(name);
    if (response.status === 0) {
      message.success('图片删除成功',1);
    } else {
      message.error('图片删除失败',1);
    }
  }

  getImgNames() {
    let imgs = [];
    this.state.fileList.forEach((item)=>{
      imgs.push(item.name);
    })
    return imgs;
  }
  
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${BASE_URL}/manage/img/upload`}//上传地址（往哪个地址发请求）Upload可以帮我们自动生成一个文件对象，发送请求，但请求的地址、方法、文件对象带到服务器时的参数名要我们指定
          method='post'//不写默认就是post
          listType="picture-card"//上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
          fileList={fileList}//已经上传的文件列表（受控），这个数组中有的才显示（不论服务器中有没有）
          onPreview={this.handlePreview}//点击文件链接或预览图标时的回调
          onChange={this.handleChange}//上传文件状态改变时的回调，上传中、完成、失败、删除都会调用这个函数。
          name="image"//发到后台的文件参数名！！！重要！！要与API文档中匹配
        >
          {/**超过几个不显示uploadbutton */}
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        {/**预览框 */}
        <Modal
          visible={previewVisible}//预览框是否显示
          title={previewTitle}//预览框标题
          footer={null}
          onCancel={this.handleCancel}//关闭预览框的回调
        >
          {/**预览框中显示的图片为previewImg */}
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall