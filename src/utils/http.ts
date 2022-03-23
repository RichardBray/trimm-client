import { Dispatch } from 'redux';
import { IAction } from './interfaces';
import { isObjEmpty } from './';

interface HttpDataInput {
  [key: string]: string | number;
}

class Http {
  data: HttpDataInput = {};
  url = '';
  action = '';

  get(url: string, action: string) {
    this.url = url;
    this.action = action;

    return this.#fetchMethod('GET');
  }

  put(url: string, action: string, data: HttpDataInput) {
    this.url = url;
    this.action = action;
    this.data = data;
    return this.#fetchMethod('PUT');
  }

  post(url: string, action: string, data: HttpDataInput) {
    this.url = url;
    this.action = action;
    this.data = data;
    return this.#fetchMethod('POST');
  }

  delete(url: string, action: string, data: HttpDataInput) {
    this.url = url;
    this.action = action;
    this.data = data;
    return this.#fetchMethod('DELETE');
  }

  #fetchMethod(method: string) {
    return (dispatch: Dispatch<IAction>) =>
      fetch(this.url, this.#fetchHeader(method))
        .then((response) => response.json())
        .then((payload) => {
          dispatch({ type: this.action, payload });
        });
  }

  #fetchHeader(method: string): RequestInit | undefined {
    let fetchBody = {};
    if (isObjEmpty(this.data)) return;

    const body = JSON.stringify(this.data);
    fetchBody = { body };

    return {
      method,
      credentials: 'include',
      ...fetchBody,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
  }
}

export default new Http();
