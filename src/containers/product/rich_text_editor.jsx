import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),//创建一个初始化状态的编辑器（全选中）+内容（空）
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  //返回内容的html格式
  getRichText = ()=>{
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  
  //由html格式转换为可显示的格式并setState
  setRichText = (html)=>{
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }
  
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          // wrapperClassName="demo-wrapper"//最外侧容器样式要写在的类名
          // editorClassName="demo-editor"//编辑区域样式要写在的类名
          editorStyle={{border:'1px solid #F1F1F1'}}//也可以不用额外css文件，直接把样式写在这里
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}