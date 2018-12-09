import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import * as Sentry from '@sentry/browser';

import reducers from "./reducers";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Register from "./views/Register";
import RedirectPage from "./views/RedirectPage";
import Settings from "./views/Settings";
import { gaInit } from "./utils";
import "~/assets/styles/global";


const useDevTools = composeWithDevTools(applyMiddleware(thunk));
const middleware = process.env.NODE_ENV === "production" ? applyMiddleware(thunk) : useDevTools;
const ROOT = document.querySelector(".react-root");
const store = createStore(reducers, middleware);
Sentry.init({ dsn: "https://63e1cfd8630c4031b9f05d6e2f9937dc@sentry.io/1340368" }); 
gaInit();

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<Route path="/settings" component={Settings} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/" component={RedirectPage} />
			</Switch>
		</BrowserRouter>
	</Provider>,
	ROOT
);