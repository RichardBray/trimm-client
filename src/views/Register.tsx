import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { Link } from 'react-router-dom';

import { gaEvent } from '../utils';
import { IRegister, IReducers, IAction } from '../utils/interfaces';
import { postRegister } from '../actions/RegisterActions';

// Styles
import Inputs from '@assets/styles/components/Inputs.module.css';
import Buttons from '@assets/styles/components/Buttons.module.css';
import LoginCss from '@assets/styles/views/Login.module.css';

// Images
import logo from '@assets/img/trimm-logo.svg';

type RegisterProps = {
  postRegister: (arg0: unknown) => void;
  register: {
    code: number,
    message: string,
  };
}

class Register extends Component<RegisterProps, IRegister> {
  state = {
    username: '',
    email: '',
    password: '',
  };

  handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    this.props.postRegister(this.state);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderErrors(): JSX.Element | void {
    const { code, message } = this.props.register;
    let value: JSX.Element | string = 'The simplest signup form ever';
    let formError = false;

    if (code === 201) {
      gaEvent('Register - Success');
      value = <Navigate to="/dashboard" />;
    } else if (code === 400) {
      value = message;
      formError = true;
      gaEvent('Register - Error');
    }
    return (
      <div className={formError ? LoginCss['right-column-error'] : LoginCss['right-column']}>
        <p className={LoginCss['right-text']}>{value}</p>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <section className={LoginCss.container}>
        <div className={LoginCss['left-column']}>
          <form onSubmit={(e) => this.handleSubmit(e)} className={`dis-f fd-c ${LoginCss['left-column-form']}`}>
            <div className={LoginCss['logo-pos']}>
              <img src={logo} alt="Trimm logo" className={LoginCss['logo-width']} />
            </div>
            <input
              type="text"
              name="username"
              value={this.state.username}
              className={Inputs.input}
              placeholder="Your first name"
              onChange={(e) => this.handleChange(e)}
              required
            />
            <input
              type="email"
              name="email"
              value={this.state.email}
              className={Inputs.input}
              placeholder="Email Address"
              onChange={(e) => this.handleChange(e)}
              required
            />
            <input
              type="Password"
              name="password"
              value={this.state.password}
              className={Inputs.input}
              placeholder="Password"
              onChange={(e) => this.handleChange(e)}
              required
            />
            <button type="submit" className={Buttons['primary-btn']} value="Register">
              Register
            </button>
          </form>
          <div className={LoginCss['register-link']}>
            <Link to="/login">Login</Link>
          </div>
        </div>
        {this.renderErrors()}
      </section>
    );
  }
}

function mapStateToProps(state: IReducers) {
  return { register: state.register };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ postRegister }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
