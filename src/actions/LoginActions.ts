/* global fetch */
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { ILogin, IAction } from "../uitls/interfaces";
import { LOGIN_API, LOGIN_STATUS, GET_LOGOUT, GET_LOGOUT_API } from "../uitls/constants";
import { postHeader, getHeader } from "../uitls";


export function checkLoginDetails(loginDetails: ILogin): ThunkAction<Promise<void>, {}, null, null> {
	return (dispatch: Dispatch<IAction>) => 
		fetch(LOGIN_API, postHeader(loginDetails))
		.then(response => response.json())
		.then(payload => {
			dispatch({ type: LOGIN_STATUS, payload });
		});
};

export function getLogout() {
	return (dispatch: Dispatch<IAction>) =>
		fetch(GET_LOGOUT_API, getHeader())
			.then(response => response.json())
			.then(payload => {
				dispatch({ type: GET_LOGOUT, payload })
			}); 
}