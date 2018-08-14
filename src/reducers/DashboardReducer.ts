import { IAction } from "../uitls/interfaces";
import { GET_SPENDING_ITEMS, GET_CATEGORIES, GET_USER, POST_SPENDING_ITEM } from "../uitls/constants";


export default function (state = _initialiseState(), action: IAction) {
  const {type, payload} = action;

  switch (type) {
    case GET_SPENDING_ITEMS:
      return {
        ...state,
        spending_items: payload
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: payload
      };
    case GET_USER:
      return {
        ...state,
        user_info: payload
      }; 
    case POST_SPENDING_ITEM:
      return {
        ...state,
        new_spending_item: payload
      }            
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
        ],
      code: 0
    },
    categories: {},
    user_info: {},
    new_spending_item: {}
  }
}