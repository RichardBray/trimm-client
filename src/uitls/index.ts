import { ILogin, ISpendingDate, ISpendingItem } from "./interfaces";


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

function _standardHeader(): RequestInit {
  return {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }    
  }
}