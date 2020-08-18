import jsonp from 'jsonp'
import myAxios from './myAxios'
import {BASE_URL,WEATHER_ID,WEATHER_SECRET,WEATHER_VERSION,WEATHER_CITY} from '../config'
import { message } from 'antd';
//login request
export const reqLogin = (username, password) => {
  //console.log(username,password)
  return myAxios.post(`${BASE_URL}/login`, {username,password});
}

export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`);

export const reqWeather = () => {
  return new Promise((resolve,reject)=>{
    jsonp(`https://yiketianqi.com/api?version=${WEATHER_VERSION}&appid=${WEATHER_ID}&appsecret=${WEATHER_SECRET}&cityid=${WEATHER_CITY}`,{},
    (err, data)=>{
      if(err) {
        message.error('天气请求失败');
        return new Promise(()=>{});
      } else {
        resolve(data);
      }
    });
  })
}