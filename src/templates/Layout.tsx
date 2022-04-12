import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Link } from "react-router-dom";

import { ILayout, IAction } from "../services/interfaces";
import ErrorBoundary from "./ErrorBoundary";

// Styles
import LayoutCss from "@assets/styles/components/Layout.module.css";

// Images
import logo from "@assets/img/logo-white.svg";

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
    // this.props.getLogout();
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
            <aside>
              <Link className={LayoutCss['header-link']} to="/dashboard">Dashboard</Link>
              <Link className={LayoutCss['header-link']} to="/settings">Settings</Link>
              <a className={LayoutCss['header-link']} onClick={() => this.handleLogout()}>Logout</a>
            </aside>
          </div>
        </header>
        <ErrorBoundary>
          <section className={LayoutCss['sticky-footer']}>
            {this.props.children}
          </section>
        </ErrorBoundary>
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