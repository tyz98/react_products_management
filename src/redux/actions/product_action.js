import {SAVE_PRODUCT_LIST} from '../action_types'

export const createSaveProductsAction = (productList)=>({type:SAVE_PRODUCT_LIST,data:productList})
