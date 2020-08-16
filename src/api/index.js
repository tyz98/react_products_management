import myAxios from './myAxios'

const URL = 'http://localhost:3000'
//login request
export const reqLogin = (username, password) => {
  //console.log(username,password)
  return myAxios.post(URL+'/login', {username,password});
}