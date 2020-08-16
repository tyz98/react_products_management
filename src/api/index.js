import myAxios from './myAxios'
import {BASE_URL} from '../config'
//login request
export const reqLogin = (username, password) => {
  //console.log(username,password)
  return myAxios.post(`${BASE_URL}/login`, {username,password});
}