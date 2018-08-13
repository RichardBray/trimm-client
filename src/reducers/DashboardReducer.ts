import { IAction } from "../uitls/interfaces";
import { GET_SPENDING_ITEMS, GET_CATEGORIES, GET_USER, DASH_DATA_LOADED } from "../uitls/constants";


export default function (state = _initialiseState(), action: IAction) {
  switch (action.type) {
    case GET_SPENDING_ITEMS:
      return {
        ...state,
        spending_items: action.payload
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case GET_USER:
      return {
        ...state,
        user_info: action.payload
      }; 
    case DASH_DATA_LOADED:
      return {
        ...state,
        data_loaded: true
      };             
    default:
      return state;
  }
}

function _initialiseState() {
  return {
    spending_items: {
      data: [
          {
            item_uuid: "b2",
            item_name: "Loading...",
            item_price: 0.00,
            create_dttm: "1979-01-01 00:00:00",
            cat_id: 1,
            cat_name: "Nothing" 
          }         
        ]
    },
    categories: {},
    user_info: {},
    data_loaded: false
  }
}