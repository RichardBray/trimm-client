// ACTIONS
export const LOGIN_STATUS: string = "LOGIN_STATUS";
export const GET_LOGOUT: string = "GET_LOGOUT";

export const GET_SPENDING_ITEMS: string = "GET_SPENDING_ITEMS";
export const GET_CATEGORIES: string = "GET_CATEGORIES";
export const GET_USER: string = "GET_USER";

export const POST_SPENDING_ITEM: string = "POST_SPENDING_ITEM";
export const POST_CATEGORIES: string = "POST_CATEGORIES";
export const POST_CATEGORY: string = "POST_CATEGORY";
export const POST_REGISTER: string = "POST_REGISTER";

export const DELETE_ITEM: string = "DELETE_ITEM";
export const DELETE_CATEGORY: string = "DELETE_CATEGORY";

export const UPDATE_CATEGORY_TOTALS: string = "UPDATE_CATEGORY_TOTALS";

// API
export const API: string = "http://localhost:3000"; // http://localhost:3000 http://209.97.183.249
export const LOGIN_API:string = `${API}/login`;
export const REGISTER_API: string = `${API}/register`;
export const GET_LOGOUT_API: string = `${API}/logout`;

export const GET_CATEGORIES_API: string = `${API}/categories`;
export const GET_CATEGORY_API: string = `${API}/category`;
export const GET_ITEMS_API: string = `${API}/items`;
export const GET_USER_API: string = `${API}/auth`;
export const ITEM_API: string = `${API}/item`;