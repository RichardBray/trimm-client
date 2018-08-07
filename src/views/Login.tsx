import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { ILogin, ILoginComp } from "../uitls/interfaces";
import { checkLoginDetails } from "../actions/LoginActions";


class Login extends Component<ILoginComp, ILogin> {

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

	render(): JSX.Element {
		return (
			<Fragment>
				<h1>Login</h1>
				<form onSubmit={e => this.handleSubmit(e)}>
					<input
						type="text"
						name="email"
						value={this.state.email}
						placeholder="Email Address"
						onChange={e => this.handleChange(e)}
					/>
					<input
						type="Password"
						name="password"
						value={this.state.password}
						placeholder="Password"
						onChange={e => this.handleChange(e)}
					/>
					<button type="submit" value="Login" />
				</form>
			</Fragment>
		)
	}
}

function mapDispatchToProps(dispatch: any) {
	return bindActionCreators({ checkLoginDetails }, dispatch);
}

export default connect(null, mapDispatchToProps)(Login);