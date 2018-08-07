/* global fetch */
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { ILogin, IAction } from "../uitls/interfaces";
import { LOGIN_API, LOGIN_STATUS } from "../uitls/constants";
import { postHeader } from "../uitls";


export function checkLoginDetails(loginDetails: ILogin): ThunkAction<Promise<void>, {}, null, null> {
	return (dispatch: Dispatch<IAction>) => {
		return fetch(LOGIN_API, postHeader(loginDetails))
			.then(response => response.json())
			.then(payload => {
				dispatch({ type: LOGIN_STATUS, payload });
			});
	};
};