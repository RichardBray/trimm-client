import * as type from '../utils/constants';
import { Http } from '../utils';
const http = new Http();

export function updateUserCurency(payload: string, userData: any) {
  const newUserData = { ...userData, user_currency: payload}
  debugger
  return http.put(type.GET_USER_API, type.UPDATE_USER_INFO, newUserData); 
}