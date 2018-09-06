import { IAction } from "../utils/interfaces";
import { POST_REGISTER } from "../utils/constants";


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
