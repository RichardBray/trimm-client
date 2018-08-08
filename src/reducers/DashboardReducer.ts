import { IAction } from "../uitls/interfaces";
import { GET_SPENDING_ITEMS, GET_CATEGORIES } from "../uitls/constants";

export default function (state = {}, action: IAction) {
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
    default:
      return state;
  }
}