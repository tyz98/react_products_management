import {SAVE_TITLE, DELETE_TITLE} from '../action_types'

let initState = {
  title:'',
}
export default function menu(preState=initState,action) {
  const {type,data} = action;
  console.log('menu reducer, preState=', preState)
  let newState;
  switch (type) {
    case SAVE_TITLE:
      newState = {title:data};
      return newState;
    case DELETE_TITLE:
      newState = {title:''};
      return newState;     
    default:
      return preState;
  }
}