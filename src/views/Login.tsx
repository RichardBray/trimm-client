import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { ILogin } from "../uitls/interfaces";
import { checkLoginDetails } from "../actions/LoginActions";


class Login extends Component<{}, {}> {

    static state: ILogin = {
        email: "",
        password: ""
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        checkLoginDetails(this.state);
    }

    handleChange(): void {

    }

    render(): JSX.Element {
       return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <input 
                    type="text" 
                    placeholder="Email Address"
                   onChange={() => this.handleChange()} 
                />
                <input 
                    type="Password" 
                    placeholder="Password"
                   onChange={() => this.handleChange()} 
                />
                <button type="submit" value="Login" />
            </form>
       ) 
    }
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({ checkLoginDetails }, dispatch);
}

export default connect(null, mapDispatchToProps)(Login);