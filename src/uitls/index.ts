/* global fetch */
import { Dispatch } from 'redux';

import { ILogin, ISpendingDate, ISpendingItem, IAction } from "./interfaces";
import { Component } from 'react';


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

/**
 * Adds `0` to month if it has single number
 * @example _modifyMonth(8) // 08
 * @example _modifyMonth(11) // 11
 */
export function modifyMonth(month: number): string {
  return (`0${month}`).slice(-2);
}

export class PageHandler extends Component<{}, {}> {
  constructor(props: {}) {
    super(props)
  };

  handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ [e.target.name]: e.target.value });
  }
}