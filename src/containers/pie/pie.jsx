import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Pie extends Component {
  getOption = ()=>{
    return {
      title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    series : [
      {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data:[
              {value:235, name:'视频广告'},
              {value:274, name:'联盟广告'},
              {value:310, name:'邮件营销'},
              {value:335, name:'直接访问'},
              {value:400, name:'搜索引擎'}
          ]
      }
  ]
    }
  }
  render() {
    return (
      <div>
        <ReactEcharts option={this.getOption()} />
      </div>
    );
  }
}

export default Pie;