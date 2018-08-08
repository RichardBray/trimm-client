import { ILogin, ISpendingDate } from "./interfaces";


export function postHeader(data: ILogin | ISpendingDate): RequestInit {
  return {
    method: "POST",
    body: JSON.stringify(data),
    ..._standardHeader()
  };
}

export function getHeader(): RequestInit {
  return {
    method: "GET",
    ..._standardHeader()
  };
}

function _standardHeader(): RequestInit {
  return {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }    
  }
}