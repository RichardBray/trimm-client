import { IAction } from "../utils/interfaces";
import { UPDATE_USER_INFO } from "../utils/constants";


export default function (state = {}, action: IAction) {
  switch (action.type) {
    case UPDATE_USER_INFO:
      return action.payload
    default:
      return state;
  }
}
