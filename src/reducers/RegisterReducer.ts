import { IAction } from "../uitls/interfaces";
import { POST_REGISTER } from "../uitls/constants";


export default function (state = {}, action: IAction) {
  switch (action.type) {
    case POST_REGISTER:
      return {
        ...action.payload
      }
    default:
      return state;
  }
}
