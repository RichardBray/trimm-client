import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { bindActionCreators, Dispatch } from "redux";

import { ILogin, ILoginView, IAction, IReducers } from "../uitls/interfaces";
import { checkLoginDetails } from "../actions/LoginActions";
import { PageHandler } from "../uitls";

// Styles
import Inputs from "~/assets/styles/components/Inputs";
import Buttons from "~/assets/styles/components/Buttons";
import LoginCss from "~/assets/styles/views/Login";

// Images
import logo from "~/assets/img/trimm-logo.svg";


class Login extends PageHandler<ILoginView, ILogin> {

	state: ILogin = {
		email: "",
		password: ""
	}

	handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		this.props.checkLoginDetails(this.state);
	}

	renderError(): JSX.Element | void {
		const { code, message } = this.props.login;
		let value: JSX.Element | string = "Fill in your username and password";

		if (code === 200) {
			value = <Redirect to="/dashboard" />
		} else if (code === 400) {
			value = message;
		}	
		return <div className={LoginCss.left_column}><p className={LoginCss.left_text}>{value}</p></div>;	
	}

	render(): JSX.Element {
		return (
			<section className="dis-f jc-sb">
				<form onSubmit={e => this.handleSubmit(e)} className="dis-f fd-c">
					<img src={logo} alt="Trimm logo"/>
					<input
						type="email"
						name="email"
						value={this.state.email}
						className={Inputs.input}
						placeholder="Email Address"
						onChange={e => this.handleChange(e)}
						required
					/>
					<input
						type="Password"
						name="password"
						value={this.state.password}
						className={Inputs.input}
						placeholder="Password"
						onChange={e => this.handleChange(e)}
						required
					/>
					<button 
						type="submit" 
						className={Buttons.primary_btn} 
						value="Login">
							Login
					</button>
				</form>
				{this.renderError()}
			</section>
		)
	}
}

function mapStateToProps(state: IReducers) {
	return { login: state.login };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
	return bindActionCreators({ checkLoginDetails }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);