import {combineReducers} from 'redux'
import testReducer from './test_reducer'

export default combineReducers({
  test:testReducer,
});