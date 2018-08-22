import { ThunkAction } from 'redux-thunk';

import { IRegister } from "../uitls/interfaces";
import { Http } from "../uitls";
import { REGISTER_API, POST_REGISTER } from '../uitls/constants';
const http = new Http();

export function postRegister(registerDetails: IRegister): ThunkAction<Promise<void>, {}, null, null> {
  return http.post(REGISTER_API, POST_REGISTER, registerDetails);
};