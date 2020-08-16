import {SAVE_USER_INFO} from '../action_types'

export const createSaveUserInfoAction = (value)=>{
  localStorage.setItem('user',JSON.stringify(value.user));
  localStorage.setItem('token',value.token);
  return {type:SAVE_USER_INFO, data:value};
};
