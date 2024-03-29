import { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { gaEvent } from '../utils';
import Http from '../services/Http';

// Styles
import inputCss from '@assets/styles/components/Inputs.module.css';
import buttonCss from '@assets/styles/components/Buttons.module.css';
import loginCss from '@assets/styles/views/Login.module.css';

// Images
import logo from '@assets/img/trimm-logo.svg';

type LoginState = {
  [key: string]: string | Record<string, string | boolean>;
  username: string;
  password: string;
  apiResponse: {
    accessToken?: string;
    refreshToken?: string;
  };
  rightColumn: {
    text: string;
    errorExists: boolean;
  };
};

type LoginProps = {
  navigate?: (arg: string) => void;
};

class Login extends Component<LoginProps, LoginState> {
  state: LoginState = {
    username: '',
    password: '',
    apiResponse: {},
    rightColumn: {
      text: 'Fill in your username and password',
      errorExists: false,
    },
  };

  render() {
    return (
      <section className={loginCss.container}>
        <div className={loginCss['left-column']}>
          <form onSubmit={(e) => this.#handleSubmit(e)} className={`dis-f fd-c ${loginCss['left-column-form']}`}>
            <div className={loginCss['logo-pos']}>
              <img src={logo} className={loginCss['logo-width']} alt="Trimm logo" />
            </div>
            <input
              type="email"
              name="username"
              value={this.state.username}
              className={inputCss.input}
              placeholder="Email Address"
              onChange={(e) => this.#handleChange(e)}
              required
            />
            <input
              type="Password"
              name="password"
              value={this.state.password}
              className={inputCss.input}
              placeholder="Password"
              onChange={(e) => this.#handleChange(e)}
              required
            />
            <button type="submit" className={buttonCss['primary-btn']} value="Login">
              Login
            </button>
          </form>
          <div className={loginCss['register-link']}>
            <Link to="/register">Register</Link>
          </div>
        </div>
        {this.#renderRightColumn()}
      </section>
    );
  }

  async #handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      username: this.state.username,
      password: this.state.password,
    };

    const reponse = await Http.post('/login', {
      body: JSON.stringify(data),
    });

    this.#handleApiResponse(reponse);
  }

  #handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [e.target.name]: e.target.value });
  }

  #renderRightColumn() {
    const { text, errorExists } = this.state.rightColumn;

    return (
      <div className={errorExists ? loginCss['right-column-error'] : loginCss['right-column']}>
        <p className={loginCss['right-text']}>{text}</p>
      </div>
    );
  }

  #handleApiResponse(response: {
    accessToken?: string;
    refreshToken?: string;
  }) {
    const accessTokenExists = response.accessToken;

    if (accessTokenExists) {
      gaEvent('User Login - Success');
      sessionStorage.setItem('accessToken', response.accessToken as string);
      this.props.navigate?.('/dashboard');
    } else {
      gaEvent('User Login - Error');
      const rightColumnClone = { ...this.state.rightColumn };

      rightColumnClone.text = 'Invalid username or password';
      rightColumnClone.errorExists = true;

      this.setState({ rightColumn: rightColumnClone });
    }
  }
}

function withHooks(Comp: typeof Login) {
  function CompWithHooks(props: LoginProps) {
    const navigate = useNavigate();

    return <Comp {...props} navigate={navigate} />;
  }

  return CompWithHooks;
}

export default withHooks(Login);
