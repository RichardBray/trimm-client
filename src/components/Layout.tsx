import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { ILayout, IAction } from "../utils/interfaces";
import { getLogout } from "../actions/LoginActions";

// Styles
import LayoutCss from "~/assets/styles/components/Layout";
import HelpersCss from "~/assets/styles/helpers";

// Images
import logo from "~/assets/img/logo-white.svg";

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
    const date = new Date();
    const currentYear = date.getFullYear();
    return (
      <Fragment>
        <header className={LayoutCss['main-header']}>
          <div className={LayoutCss['header-container']}>
            <img 
              src={logo} 
              alt="Trimm Logo"
              className={LayoutCss['main-header__logo']} />
            <a className={HelpersCss['cur-p']} onClick={() => this.handleLogout()}>Logout</a>
          </div>
        </header>
        <section className={LayoutCss['sticky-footer']}>
          {this.props.children}
        </section>
        <footer className={LayoutCss.footer}>
          <section className={LayoutCss.container}>
            Trimm &copy; {currentYear}
          </section>
        </footer>
      </Fragment>
    )
  }
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getLogout }, dispatch);
}

export default connect(null, mapDispatchToProps)(Layout);