const API = import.meta.env.VITE_API_URL;

// ACTIONS
export const LOGIN_STATUS = 'LOGIN_STATUS';
export const GET_LOGOUT = 'GET_LOGOUT';

export const GET_SPENDING_ITEMS = 'GET_SPENDING_ITEMS';
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_USER = 'GET_USER';

export const POST_SPENDING_ITEM = 'POST_SPENDING_ITEM';
export const POST_CATEGORIES = 'POST_CATEGORIES';
export const POST_CATEGORY = 'POST_CATEGORY';
export const POST_REGISTER = 'POST_REGISTER';

export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';

export const FILTER_SPENDING_ITEMS = 'FILTER_SPENDING_ITEMS';

export const DELETE_ITEM = 'DELETE_ITEM';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export const UPDATE_CATEGORY_TOTALS = 'UPDATE_CATEGORY_TOTALS';

// API
export const LOGIN_API = `${API}/login`;
export const REGISTER_API = `${API}/register`;
export const GET_LOGOUT_API = `${API}/logout`;

export const GET_CATEGORIES_API = `${API}/categories`;
export const GET_CATEGORY_API = `${API}/category`;
export const GET_ITEMS_API = `${API}/items`;
export const GET_USER_API = `${API}/auth`;
export const EDIT_USER_API = `${API}/user-edit`;
export const ITEM_API = `${API}/item`;
