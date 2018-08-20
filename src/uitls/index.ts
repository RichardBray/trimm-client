import { Dispatch } from 'redux';

import { ILogin, ISpendingDate, ISpendingItem, IAction } from "./interfaces";


export function postHeader(data: ILogin | ISpendingDate | ISpendingItem): RequestInit {
  return {
    method: "POST",
    body: JSON.stringify(data),
    ..._standardHeader()
  };
}

export function deleteHeader(data: any): RequestInit {
  return {
    method: "DELETE",
    body: JSON.stringify(data),
    ..._standardHeader()
  }
}

export function getHeader(): RequestInit {
  return {
    method: "GET",
    ..._standardHeader()
  };
}

export function fetchFunc(url: string, action: string, func: (data?: any) => {}, data?: any) {
  return (dispatch: Dispatch<IAction>) =>
    fetch(url, func(data))
      .then(response => response.json())
      .then(payload => {
        dispatch({ type: action, payload })
      });
}

function _standardHeader(): RequestInit {
  return {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }    
  }
}