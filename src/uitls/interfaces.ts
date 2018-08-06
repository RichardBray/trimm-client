export interface ILogin {
    email: string,
    password: string
}

export interface IAction {
    type: string;
    payload: any | null;
}