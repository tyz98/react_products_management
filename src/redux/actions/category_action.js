import {SAVE_CATEGORY_LIST} from '../action_types'

export const createSaveCategoriesAction = (categoryList)=>({type:SAVE_CATEGORY_LIST,data:categoryList})
