export interface ILogin {
  [key: string]: string;
  password: string;
}

export interface IRegister extends ILogin {
  username: string;
}

export interface ILoginView {
  login: ILoginResponse;
  checkLoginDetails: (state: ILogin) => Record<string, unknown>;
}

export interface ILoginResponse {
  refreshToken: string;
  accessToken: string;
}

export interface IDashvoardView {
  dashboard: any; // TODO
  getCategories: () => Record<string, unknown>;
  getSpendingItems: (date: IDashboardDate) => Record<string, unknown>;
  getUserInfo: () => Record<string, unknown>;
  postSpendingItem: (data: any) => Record<string, unknown>;
  deleteCategory: (data: string) => Record<string, unknown>;
  postNewCategory: (data: string) => Record<string, unknown>;
  filterSpendingItems: (data: any) => Record<string, unknown>;
  updateCategoriesTotal: any;
}

export interface IDashboardState {
  data_loaded: boolean | any;
  date: IDashboardDate;
  spending_item: any;
  new_category: string;
  user_currency: string;
  categories: Record<string, unknown>;
  show_welcome: boolean;
  filter_id: number;
}

export interface ISpendingItem {
  [key: string]: string | number;
  item_name: string;
  item_price: number;
  create_dttm: string;
  cat_id: string;
}

export interface IDashboardDate {
  month: number;
  year: number;
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
  children: JSX.Element[];
  getLogout: () => Record<string, unknown>;
}

export interface IServerResponses {
  [key: number]: JSX.Element[] | JSX.Element | any;
}
