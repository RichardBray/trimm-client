


export interface ILoginResponse {
  refreshToken: string;
  accessToken: string;
}



export interface ISpendingItem {
  [key: string]: string | number;
  item_name: string;
  item_price: number;
  create_dttm: string;
  cat_id: string;
}

// export interface ISpendingDate {
//   [key: string]: string;
//   start_date: string;
//   end_date: string;
// }

export interface IAction {
  type: string;
  payload: any | null;
}

export interface IReducers {
  login: ILoginResponse;
  dashboard: any;
  register: any;
  settings: any;
}

export interface ILayout {
  children: JSX.Element[] | JSX.Element;
}

export interface IServerResponses {
  [key: number]: JSX.Element[] | JSX.Element | any;
}
