import {SAVE_PRODUCT_LIST} from '../action_types'

let initState = [];
export default function login(preState=initState,action) {
  const {type,data} = action;
  let newState;
  switch (type) {
    case SAVE_PRODUCT_LIST:
      newState = data;
      return newState;
    default:
      return preState;
  }
}