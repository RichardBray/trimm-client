import { IAction } from "../utils/interfaces";
import { LOGIN_STATUS, GET_LOGOUT } from "../utils/constants";


export default function (state = {}, action: IAction) {
	switch (action.type) {
		case LOGIN_STATUS:
			return {
				...action.payload
			};
		case GET_LOGOUT:
			return {
				...state,
				logout: action.payload
			}
		default:
			return state;
	}
}
