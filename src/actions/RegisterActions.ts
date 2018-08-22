import { ThunkAction } from 'redux-thunk';

import { IRegister } from "../uitls/interfaces";
import { postHeader, fetchFunc } from "../uitls";
import { REGISTER_API, POST_REGISTER } from '../uitls/constants';


export function postRegister(registerDetails: IRegister): ThunkAction<Promise<void>, {}, null, null> {
  return fetchFunc(REGISTER_API, POST_REGISTER, postHeader, registerDetails);
};