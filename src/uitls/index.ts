import { ILogin } from "./interfaces";


export function postHeader(data: ILogin): RequestInit {
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
}