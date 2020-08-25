import jsonp from 'jsonp'
import myAxios from './myAxios'
import {BASE_URL,WEATHER_ID,WEATHER_SECRET,WEATHER_VERSION,WEATHER_CITY} from '../config'
import { message } from 'antd';
//login request
export const reqLogin = (username, password) => {
  //console.log(username,password)
  return myAxios.post(`${BASE_URL}/login`, {username,password});
}

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
//category
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`);

export const reqCategoryAdd = (value) => myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName:value});

export const reqCategoryUpdate = (categoryId, categoryName) => myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId, categoryName});

//product
export const reqProductList = (pageNum,pageSize) => myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})

export const reqProductUpdateStatus = (productId,status) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status});

export const reqProductSearch = (pageNum,pageSize,searchType,keyword) => myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyword}})

export const reqProductInfo = (productId) => myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})

export const reqProductAdd = (productObj) => myAxios.post(`${BASE_URL}/manage/product/add`,productObj);

export const reqProductUpdate = (productObj) => myAxios.post(`${BASE_URL}/manage/product/update`,productObj);

//picture
export const reqPictureDelete = (name) => myAxios.post(`${BASE_URL}/manage/img/delete`,{name});

//role
export const reqRoleList = () => myAxios.get(`${BASE_URL}/manage/role/list`);

export const reqRoleAdd = (roleName) => myAxios.post(`${BASE_URL}/manage/role/add`,{roleName});

export const reqRoleAuth = (authInfo) => myAxios.post(`${BASE_URL}/manage/role/update`,{...authInfo,auth_time:Date.now()});

//user
export const reqUserList = () => myAxios.get(`${BASE_URL}/manage/user/list`);

export const reqUserAdd = (userObj) => myAxios.post(`${BASE_URL}/manage/user/add`,userObj);
