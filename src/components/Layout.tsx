import React, {Component} from "react";
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
   * Uses window.location to get rid of all the
   * redux stuff
   */
  handleLogout(): void {
    this.props.getLogout();
    window.location.replace('/');
  }

  render(): JSX.Element {
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
      </main>
    )
  }
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getLogout }, dispatch);
}

export default connect(null, mapDispatchToProps)(Layout);