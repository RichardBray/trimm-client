import { ILogin } from '../utils/interfaces';
import { LOGIN_API, LOGIN_STATUS, GET_LOGOUT, GET_LOGOUT_API } from '../utils/constants';
import Http from '../utils/http';

export function checkLoginDetails(loginDetails: ILogin) {
  return Http.post(LOGIN_API, LOGIN_STATUS, loginDetails);
}

export function getLogout() {
  return Http.get(GET_LOGOUT_API, GET_LOGOUT);
}
