import { IAction } from "../uitls/interfaces";
import { LOGIN_STATUS } from "../uitls/constants";


export default function (state = {}, action: IAction) {
	switch (action.type) {
		case LOGIN_STATUS:
			return {
				...action.payload
			};
		default:
			return state;
	}
}
