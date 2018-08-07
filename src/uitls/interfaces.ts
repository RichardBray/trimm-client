export interface ILogin {
	[email: string]: string;
	password: string;
}

export interface ILoginComp {
	checkLoginDetails: (state: ILogin) => {};
}

export interface IAction {
	type: string;
	payload: any | null;
}

