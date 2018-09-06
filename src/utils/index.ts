/* global fetch */
import { Dispatch } from 'redux';

import { IAction } from "./interfaces";
import { Component } from 'react';

var gtag:any;


window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

export function gaInit(): void {
  gtag('js', new Date());
  gtag('config', 'UA-125324369-1');
}

export function gaEvent(name: string): void {
  gtag("event", name, {
    "event_category": "Button Click",
    "event_label": "Trimm App"
  });
}

export class PageHandler extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);  
    window.Intercom("update");
  };

  handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ [e.target.name]: e.target.value });
  }
}

export class Http {
  data: any = false;
  url: string = "";
  action: string = "";

  get(url: string, action: string) {
    this.url = url;
    this.action = action;
    this.data = false;

    return this._fetchMethod("GET");
  }

  post(url: string, action: string, data: any) {
    this.url = url;
    this.action = action;  
    this.data = data;    
    return this._fetchMethod("POST");
  }

  delete(url: string, action: string, data: any) {
    this.url = url;
    this.action = action;
    this.data = data;      
    return this._fetchMethod("DELETE");
  }

  private _fetchMethod(method: string) {
    return (dispatch: Dispatch<IAction>) =>
      fetch(this.url, this._fetchHeader(method))
        .then(response => response.json())
        .then(payload => {
          dispatch({ type: this.action, payload })
        });    
  }

  private _fetchHeader(method: string): RequestInit {
    const body = JSON.stringify(this.data);
    const fetchBody = this.data && { body };
    return {
      method,
      credentials: "include",
      ...fetchBody,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
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

export function monthToText(month: string | number): string {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (month === 13) {
    return monthNames[0]
  }

  if (month === 0) {
    return monthNames[11]
  }
  return monthNames[+month -1];
}