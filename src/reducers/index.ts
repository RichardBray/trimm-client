import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import { IReducers } from "../uitls/interfaces";
import { Reducer, AnyAction } from "../../node_modules/redux";


const rootReducer: Reducer<IReducers, AnyAction> = combineReducers({
  login: LoginReducer
});

export default rootReducer;