import { Component } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';

import { ILogin, ILoginView, IAction, IReducers } from '../utils/interfaces';
import { checkLoginDetails } from '../actions/LoginActions';
import { gaEvent } from '../utils';

// Styles
import Inputs from '@assets/styles/components/Inputs.module.css';
import Buttons from '@assets/styles/components/Buttons.module.css';
import LoginCss from '@assets/styles/views/Login.module.css';

// Images
import logo from '@assets/img/trimm-logo.svg';

class Login extends Component<ILoginView, ILogin> {
  state: ILogin = {
    username: '',
    password: '',
  };

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.checkLoginDetails(this.state);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderError() {
    const { accessToken } = this.props.login;
    let value ='Fill in your username and password';
    let formError = false;

    if (!accessToken) {
      gaEvent('User Login - Success');
      <Navigate to="/dashboard" />;
    } else {
      gaEvent('User Login - Error');
      value = 'Invalid username or password';
      formError = true;
    }
    return (
      <div className={formError ? LoginCss['right-column-error'] : LoginCss['right-column']}>
        <p className={LoginCss['right-text']}>{value}</p>
      </div>
    );
  }

  render() {
    return (
      <section className={LoginCss.container}>
        <div className={LoginCss['left-column']}>
          <form onSubmit={(e) => this.handleSubmit(e)} className={`dis-f fd-c ${LoginCss['left-column-form']}`}>
            <div className={LoginCss['logo-pos']}>
              <img src={logo} className={LoginCss['logo-width']} alt="Trimm logo" />
            </div>
            <input
              type="email"
              name="username"
              value={this.state.username}
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
            <button type="submit" className={Buttons['primary-btn']} value="Login">
              Login
            </button>
          </form>
          <div className={LoginCss['register-link']}>
            <Link to="/register">Register</Link>
          </div>
        </div>
        {this.renderError()}
      </section>
    );
  }
}

function mapStateToProps(state: IReducers) {
  return { login: state.login };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ checkLoginDetails }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
