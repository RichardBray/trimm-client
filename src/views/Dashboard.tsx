import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCategories, getSepdningItems, getUserInfo, checkDataLoaded } from "../actions/DashboardActions";

import { IDashvoardView, IReducers, IAction } from "../uitls/interfaces";


class Dashboard extends Component<IDashvoardView, {}> {

  state = {
    date: {
      month: 7,
      year: 2018
    },
    data_loaded: false
  }

  /**
   * Get all the data needed for
   * this page.
   */
  componentDidMount(): void {
    this.props.checkDataLoaded();
    this.props.getUserInfo();
    this.props.getCategories();
    this.props.getSepdningItems(this.state.date);        
  }

  /**
   * Checks if data from redux is loaded then
   * hides loading spinner if it is.
   */
  componentDidUpdate(): void {
    if (!this.state.data_loaded) {
      this.setState({ data_loaded: this.props.dashboard.data_loaded });
    }
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
    if (this.state.data_loaded) {
      return (
        <Fragment>
          <h1>Hi {this.props.dashboard.user_info.user_name}</h1>
          <span>Here is this months data.</span>
        </Fragment>
      )      
    }
    return <h1>Loading...</h1>
  }
}

function mapStateToProps(state: IReducers) {
  return { dashboard: state.dashboard };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getCategories, getSepdningItems, getUserInfo, checkDataLoaded }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);