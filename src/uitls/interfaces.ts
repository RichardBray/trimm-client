

export interface ILogin {
	[email: string]: string;
	password: string;
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
	getSepdningItems: (date: IDashboardDate) => {};
	getUserInfo: () => {};
}

export interface IDashboardState {
	date: IDashboardDate;
	data_loaded: boolean;
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
	login: ILoginResponse
	dashboard: any
}

export interface ILayout {
	children: JSX.Element[];
	getLogout: () => {};
}
