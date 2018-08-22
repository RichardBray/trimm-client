import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { bindActionCreators, Dispatch } from "redux";

import { PageHandler } from "../uitls";
import { IRegister, IReducers, IAction } from "../uitls/interfaces";
import { postRegister } from "../actions/RegisterActions";


class Register extends PageHandler<{}, IRegister> {
  state = {
    username: "",
    email: "",
    password: ""
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    this.props.postRegister(this.state);
  }

  renderErrors(): JSX.Element | void {
    const { code, message } = this.props.register;
    let value: JSX.Element | string = "The simplest signup form ever";

    if (code === 201) {
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
            name="username"
            value={this.state.username}
            placeholder="Your first name"
            onChange={e => this.handleChange(e)}
            required
          />
          <input
            type="email"
            name="email"
            value={this.state.email}
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
          <button type="submit" value="Register">Register</button>
        </form>
        {this.renderErrors()}
      </section>
    )
  }  
}

function mapStateToProps(state: IReducers) {
  return { register: state.register };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ postRegister }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Register);