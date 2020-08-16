import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'

const instance = axios.create({
  //baseURL: 'https://localhost:4000/',
  timeout: 4000,
});

instance.interceptors.request.use((config)=>{
  //console.log('请求拦截器config',config);
  const {method,data} = config;
  if (method.toLowerCase() === 'post' && data instanceof Object) {
    config.data = qs.stringify(data);
  }
  return config;
});

instance.interceptors.response.use((response)=>{
  //console.log('响应拦截器response',response.data);
  return response.data;
},(err)=>{
  //console.log('响应拦截器err',err.message);
  message.error('发送请求失败,'+err.message, 1);
  //中断promise
  return new Promise(()=>{});
});

export default instance;
