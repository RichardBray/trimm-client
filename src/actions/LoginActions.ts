import { ThunkAction } from 'redux-thunk';

import { ILogin } from "../utils/interfaces";
import { LOGIN_API, LOGIN_STATUS, GET_LOGOUT, GET_LOGOUT_API } from "../utils/constants";
import { Http } from "../utils";
const http = new Http();

export function checkLoginDetails(loginDetails: ILogin): ThunkAction<Promise<void>, {}, null, null> {
	return http.post(LOGIN_API, LOGIN_STATUS, loginDetails);
};

export function getLogout() {
	return http.get(GET_LOGOUT_API, GET_LOGOUT);
}