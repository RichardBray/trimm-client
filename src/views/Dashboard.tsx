import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCategories, getSepdningItems } from "../actions/DashboardActions";

import { IDashvoardView, IReducers, IAction } from "../uitls/interfaces";


class Dashboard extends Component<IDashvoardView, {}> {

  state = {
    month: 7,
    year: 2018
  }

  componentDidMount(): void {
    this.props.getCategories();
    this.props.getSepdningItems(this.state)
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

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getCategories, getSepdningItems }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);