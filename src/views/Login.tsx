import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { bindActionCreators, Dispatch } from "redux";

import { ILogin, ILoginView, IAction, IReducers } from "../uitls/interfaces";
import { checkLoginDetails } from "../actions/LoginActions";

import styles from "~/assets/styles/components/Inputs";


class Login extends Component<ILoginView, ILogin> {

	state: ILogin = {
		email: "",
		password: ""
	}

	handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		this.props.checkLoginDetails(this.state);
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({ [e.target.name] : e.target.value });
	}

	renderError(): JSX.Element | void {
		const { code, message } = this.props.login;
		let value: JSX.Element | string = "Fill in your username and password";

		if (code === 200) {
			value = <Redirect to="/dashboard" />
		} else if (code === 400) {
			value = message;
		}	
		return <div>{value}</div>;	
	}

	render(): JSX.Element {
		return (
			<section className="dis-f jc-sb">
				<form onSubmit={e => this.handleSubmit(e)}>
					<input
						type="text"
						name="email"
						value={this.state.email}
						className={styles.input}
						placeholder="Email Address"
						onChange={e => this.handleChange(e)}
						required
					/>
					<input
						type="Password"
						name="password"
						value={this.state.password}
						placeholder="Password"
						onChange={e => this.handleChange(e)}
						required
					/>
					<button type="submit" value="Login">Login</button>
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