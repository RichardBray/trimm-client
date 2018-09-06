import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";

import { ILogin, ILoginView, IAction, IReducers } from "../utils/interfaces";
import { checkLoginDetails } from "../actions/LoginActions";
import { PageHandler, gaEvent } from "../utils";

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
		let formError: boolean = false;

		if (code === 200) {
			gaEvent('User Login - Success');
			value = <Redirect to="/dashboard" />
		} else if (code === 400) {
			gaEvent('User Login - Error');
			value = message;
			formError = true;
		}	
		return (
			<div className={formError ? LoginCss['right-column-error'] : LoginCss['right-column']}>
				<p className={LoginCss['right-text']}>
					{value}
				</p>
			</div>);	
	}

	render(): JSX.Element {
		return (
			<section className={LoginCss.container}>
				<div className={LoginCss['left-column']}>
					<form 
						onSubmit={e => this.handleSubmit(e)} 
						className={`dis-f fd-c ${LoginCss['left-column-form']}`}>
						<div className={LoginCss['logo-pos']}>
							<img src={logo} className={LoginCss['logo-width']} alt="Trimm logo"/>
						</div>
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
							className={Buttons['primary-btn']} 
							value="Login">
								Login
						</button>
					</form>
					<div className={LoginCss['register-link']}>
						<Link to="/register">Register</Link>
					</div>
				</div>
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