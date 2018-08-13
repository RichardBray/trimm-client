import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCategories, getSepdningItems, getUserInfo } from "../actions/DashboardActions";

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
  async componentDidMount() {
    await this.props.getCategories();
    await this.props.getSepdningItems(this.state.date);   
    await this.props.getUserInfo(); 
    this.setState({ data_loaded: true });
  }

  renderCategories(): void {
    // pass
  }

  renderSpendingForm(): void {
    // pass
  }

  renderSpendingItems(): JSX.Element[] | JSX.Element {
    const { spending_items } =  this.props.dashboard;
    // TODO change to object
    if (spending_items.code === 200) {
      return spending_items.data.map((item: any) => (
          <div key={item.item_uuid}>
            {item.item_name}
            {item.item_price}
            {item.create_dttm}
            {item.cat_name}
          </div>
        )
      );
    } else if (spending_items.code === 404) {
      return <div>You have no items</div>
    } // 401 you're not authorised
    return <div>Loadnig...</div>
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
  return bindActionCreators({ getCategories, getSepdningItems, getUserInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);