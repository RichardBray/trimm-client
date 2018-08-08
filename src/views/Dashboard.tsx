import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { IDashvoardView, IReducers } from "../uitls/interfaces";


class Dashboard extends Component<IDashvoardView, {}> {

  componentDidMount(): void {
    // get spending info
    // get categories
  }

  renderCategories(): void {
    // pass
  }

  renderSpendingForm(): void {
    // pass
  }

  renderSpendingItems(): void {
    // pass
  }

  render(): JSX.Element {
    return (
      <Fragment>
        <h1>Hi {this.props.login.user_name}</h1>
        <span>Here is this months data.</span>
      </Fragment>
    )
  }
}

function mapStateToProps(state: IReducers) {
  return { login: state.login };
}
export default connect(mapStateToProps)(Dashboard);