import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";


const rootReducer = combineReducers({
    login: LoginReducer
});

export default rootReducer;