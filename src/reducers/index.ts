import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import DashboardReducer from "./DashboardReducer";
import { IReducers } from "../utils/interfaces";
import { Reducer, AnyAction } from "../../node_modules/redux";
import RegisterReducer from "./RegisterReducer";
import SettingsReducer from "./SettingsReducer";



const rootReducer: Reducer<IReducers, AnyAction> = combineReducers({
  login: LoginReducer,
  dashboard: DashboardReducer,
  register: RegisterReducer,
  settings: SettingsReducer
});

export default rootReducer;