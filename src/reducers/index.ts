import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import DashboardReducer from "./DashboardReducer";
import { IReducers } from "../uitls/interfaces";
import { Reducer, AnyAction } from "../../node_modules/redux";



const rootReducer: Reducer<IReducers, AnyAction> = combineReducers({
  login: LoginReducer,
  dashboard: DashboardReducer
});

export default rootReducer;