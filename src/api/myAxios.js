import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'
import NProgress from 'nprogress'
import store from '../redux/store'
import 'nprogress/nprogress.css'

const instance = axios.create({
  timeout: 4000,
});

instance.interceptors.request.use((config)=>{
  //console.log('请求拦截器config',config);
  NProgress.start();
  //add authorization(headers)
  const {token} = store.getState().userInfo;
  if (token) {
    config.headers.Authorization = 'tyz98_'+token;
  }
  const {method,data} = config;
  //convert to urlencoded
  if (method.toLowerCase() === 'post' && data instanceof Object) {
    config.data = qs.stringify(data);
  }
  return config;
});

instance.interceptors.response.use((response)=>{
  //console.log('响应拦截器response',response.data);
  NProgress.done();
  return response.data;
},(err)=>{
  //console.log('响应拦截器err',err.message);
  NProgress.done();
  message.error('发送请求失败,'+err.message, 1);
  //中断promise
  return new Promise(()=>{});
});

export default instance;
