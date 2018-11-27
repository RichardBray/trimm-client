import * as type from '../utils/constants';
import { Http } from '../utils';
const http = new Http();

export function updateUserCurency(currency: string, userData: any) {
  const newUserData = { ...userData, user_currency: currency}
  try {
    return http.put(type.EDIT_USER_API, type.UPDATE_USER_INFO, newUserData); 
  } catch(error) {
    console.error(error);
    alert('Something has gone wrong with our server :(')
  }
}