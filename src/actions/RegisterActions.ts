import { IRegister } from '../utils/interfaces';
import Http from '../utils/http';
import { REGISTER_API, POST_REGISTER } from '../utils/constants';

export function postRegister(registerDetails: IRegister) {
  return Http.post(REGISTER_API, POST_REGISTER, registerDetails);
}
