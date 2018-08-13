import React, {Component} from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { ILayout, IAction } from "../uitls/interfaces";
import { getLogout } from "../actions/LoginActions";


class Layout extends Component<ILayout, {}> {

  state = {
    logged_out: false
  }

  /**
   * Removed `auth` cookie with the API
   */
  handleLogout(): void {
    this.props.getLogout();
    this.setState({logged_out: true});
  }

  render(): JSX.Element {
    console.log(this.state);
    return (
      <main>
        <header>
          <div>Logo</div>
          <a onClick={() => this.handleLogout()}>Logout</a>
        </header>
        <section>
          {this.props.children}
        </section>
        <footer>
          Trimm &copy; 2019
        </footer>
        {this.state.logged_out && <Redirect to="/" />}
      </main>
    )
  }
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getLogout }, dispatch);
}

export default connect(null, mapDispatchToProps)(Layout);