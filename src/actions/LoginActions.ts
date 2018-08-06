/* global fetch */
import { ILogin } from "../uitls/interfaces";
import { LOGIN_API, LOGIN_STATUS } from "../uitls/constants";


export function checkLoginDetails(loginDetails: ILogin): any {
    return dispatch =>
        fetch(LOGIN_API)
        .then(response => response.json())
        .then(payload => {
            dispatch({ type: LOGIN_STATUS, payload });
        });
}