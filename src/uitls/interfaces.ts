

export interface ILogin {
	[email: string]: string;
	password: string;
}

export interface ILoginComp {
	login: ILogin;
	checkLoginDetails: (state: ILogin) => {};
}

export interface IAction {
	type: string;
	payload: any | null;
}

export interface IReducers {
	login: ILogin
}
