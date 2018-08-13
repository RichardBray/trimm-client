import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCategories, getSepdningItems, getUserInfo, checkDataLoaded } from "../actions/DashboardActions";

import { IDashvoardView, IReducers, IAction, IDashboardState } from "../uitls/interfaces";
import Layout from "../components/Layout";


class Dashboard extends Component<IDashvoardView, IDashboardState> {

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

  renderSpendingItems(): JSX.Element[] {
    const spending_items  =  this.props.dashboard.spending_items.data;
    return spending_items.map((item: any) => {
      return (
        <div key={item.item_uuid}>
          {item.item_name}
          {item.item_price}
          {item.create_dttm}
          {item.cat_name}
        </div>
      )
    });
  }

  render(): JSX.Element {
    if (this.state.data_loaded) {
      return (
        <Layout>
          <h1>Hi {this.props.dashboard.user_info.user_name}</h1>
          <span>Here is this months data.</span>
          {this.renderSpendingItems()}
        </Layout>
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