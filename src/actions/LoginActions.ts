import { ThunkAction } from 'redux-thunk';

import { ILogin } from "../uitls/interfaces";
import { LOGIN_API, LOGIN_STATUS, GET_LOGOUT, GET_LOGOUT_API } from "../uitls/constants";
import { postHeader, getHeader, fetchFunc } from "../uitls";


export function checkLoginDetails(loginDetails: ILogin): ThunkAction<Promise<void>, {}, null, null> {
	return fetchFunc(LOGIN_API, LOGIN_STATUS, postHeader, loginDetails); 
};

export function getLogout() {
	return fetchFunc(GET_LOGOUT_API, GET_LOGOUT, getHeader);
}