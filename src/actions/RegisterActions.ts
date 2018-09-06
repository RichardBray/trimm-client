import { ThunkAction } from 'redux-thunk';

import { IRegister } from "../utils/interfaces";
import { Http } from "../utils";
import { REGISTER_API, POST_REGISTER } from '../utils/constants';
const http = new Http();

export function postRegister(registerDetails: IRegister): ThunkAction<Promise<void>, {}, null, null> {
  return http.post(REGISTER_API, POST_REGISTER, registerDetails);
};