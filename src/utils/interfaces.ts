

export interface ILogin {
	[email: string]: string;
	password: string;
}

export interface IRegister extends ILogin {
	username: string;
}

export interface ILoginView {
	login: ILoginResponse;
	checkLoginDetails: (state: ILogin) => {};
}

export interface ILoginResponse {
	user_name: string;
	user_email: string;
	user_currency: string;
	code: number;
	message?: string;
}

export interface IDashvoardView {
	dashboard: any;  // TODO
	getCategories: () => {};
	getSpendingItems: (date: IDashboardDate) => {};
	getUserInfo: () => {};
	postSpendingItem: (data: any) => {};
	deleteCategory: (data: string) => {};
	postNewCategory: (data: string) => {};
	updateCategoriesTotal: any;
}

export interface IDashboardState {
	data_loaded: boolean | any;
	date: IDashboardDate;
	spending_item: any;
	new_category: string;
	user_currency: string;
	categories: {};
	show_welcome: boolean;
}

export interface ISpendingItem {
	item_name: string;
	item_price: number;
	create_dttm: string;
	cat_id: string;
}

export interface IDashboardDate {
	month: number;
	year: number;
}

export interface ISpendingDate {
	start_date: string;
	end_date: string;
}

export interface IAction {
	type: string;
	payload: any | null;
}

export interface IReducers {
	login: ILoginResponse;
	dashboard: any;
	register: any;
}

export interface ILayout {
	children: JSX.Element[];
	getLogout: () => {};
}

export interface IServerResponses {
	[key: number]: JSX.Element[] | JSX.Element | any;
}
