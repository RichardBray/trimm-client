import * as type from '../utils/constants';
import Http from '../utils/http';

export function updateUserCurency(currency: string, userData: any) {
  const newUserData = { ...userData, user_currency: currency}
  try {
    return Http.put(type.EDIT_USER_API, type.UPDATE_USER_INFO, newUserData);
  } catch(error) {
    console.error(error);
    alert('Something has gone wrong with our server :(')
  }
}