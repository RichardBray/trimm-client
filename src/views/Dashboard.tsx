import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCategories, getSepdningItems, getUserInfo, postSpendingItem } from "../actions/DashboardActions";

import { IDashvoardView, IReducers, IAction, IDashboardState, IServerResponses, ISpendingItem } from "../uitls/interfaces";
import Layout from "../components/Layout";


class Dashboard extends Component<IDashvoardView, IDashboardState> {

  default_spending_item: ISpendingItem = {
    item_name: "",
    item_price: 0,
    create_dttm: "",
    cat_id: 0    
  };

  date = new Date();
  state = {
    date: {
      month: this.date.getMonth() + 1,
      year: this.date.getFullYear()
    },
    spending_item: {
      ...this.default_spending_item
    },
    data_loaded: false
  }

  /**
   * Get all the data needed for
   * this page.
   */
  async componentDidMount(): Promise<void> {
    await this.props.getCategories();
    await this.props.getSepdningItems(this.state.date);   
    await this.props.getUserInfo(); 
    this.setState({ data_loaded: true });
  }

  renderCategories(): JSX.Element[] | JSX.Element {
    const { data, code } = this.props.dashboard.categories;
    const rendeer_categories = data.map((cat: any) => (
        <div key={cat.cat_uuid}>
          {cat.cat_name}
          {cat.cat_total}
          {cat.cat_budget}
        </div>
      )
    );
    const responses: IServerResponses = {
      200: rendeer_categories,
      401: <div>Looks like you are somewhere you shouldn't be.</div>
    }

    return responses[code];
  }

  renderSpendingForm(): JSX.Element {
    const categories = this.props.dashboard.categories.data;
    const { item_name, create_dttm, item_price } = this.state.spending_item;
    const category_list = categories.map((cat: any) => (
        <option 
          key={cat.cat_id} 
          value={cat.cat_id}>
            {cat.cat_name}
        </option>
      )
    );
    return (
      <form className="dis-f" onSubmit={(e: any) => this._addSpendingItem(e)}>
        <div>
          <label htmlFor="category">Category</label>
          <select name="cat_id" onChange={e => this._handleChange(e)}>
          <option value="--">--</option>
            {category_list}
          </select>
          <input 
            type="text" 
            name="item_name" 
            placeholder="Description" 
            value={item_name}
            onChange={e => this._handleChange(e)}
            required 
          />
          <input 
            type="date" 
            name="create_dttm" 
            placeholder="Date" 
            onChange={e => this._handleChange(e)}
            value={create_dttm}
          />
        </div>
        <div>
          <input 
            type="number" 
            name="item_price" 
            placeholder="Price" 
            value={item_price}
            onChange={e => this._handleChange(e)}
            required
          />
          <button type="submit">Add Trimm</button>
        </div>
      </form>
    )
  }

  renderSpendingItems(): JSX.Element[] | JSX.Element {
    const { data, code } = this.props.dashboard.spending_items;
    const render_items = data.map((item: any) => (
        <section key={item.item_uuid} id={item.item_uuid}>
          <div>
            {item.cat_name}
            {item.item_name}
          </div>
          <div>
            {item.create_dttm}
            {item.item_price}
          </div>
        </section>
        )
      );
    const render_no_items = <div>You have no items</div>;
    const responses: IServerResponses = {
      200: render_items,
      404: render_no_items,
      401: <div>Looks like you are somewhere you shouldn't be.</div>
    }      
    debugger;
    return responses[code];
  }

  render(): JSX.Element {
    if (this.state.data_loaded) {
      return (
        <Layout>
          <h1>Hi {this.props.dashboard.user_info.user_name}</h1>
          <span>Here is this months data.</span>
          <section>
            <span onClick={() => this._changeMonth()}>Prev month</span>
            <span onClick={() => this._changeMonth(true)}>Next month</span>
          </section>
          <h2>{this.state.date.month} {this.state.date.year}</h2>
          {this.renderSpendingForm()}
          {this.renderSpendingItems()}
          {this.renderCategories()}
        </Layout>
      )      
    }
    return <h1>Loading...</h1>
  }

  private async _addSpendingItem(e: any): Promise<void> {
    e.preventDefault();
    await this.props.postSpendingItem(this.state.spending_item);
    if (this.props.dashboard.new_spending_item.code === 201) {
      await this.props.getSepdningItems(this.state.date); 
    } else {
      console.error('something has gone wrong'); // TODO change this at some point
    }

    this.setState({ spending_item: this.default_spending_item });
  }

  private _handleChange(e: any): void {
    this.setState({ spending_item: {
        ...this.state.spending_item,
        [e.target.name]: e.target.value 
      }
    });
  };

  private _changeMonth(next: boolean = false): void {
    const {month, year} = this.state.date;
    const chosenDate = new Date(`${year}-${month}-01`);
    const monthChange = next ? chosenDate.getMonth() +1 : chosenDate.getMonth() -1;
    chosenDate.setMonth(monthChange);

    const newStateDate = {
      month: chosenDate.getMonth() +1,
      year: chosenDate.getFullYear()
    };

    this.props.getSepdningItems(newStateDate);
    this.setState({ date: newStateDate });
  }
}

function mapStateToProps(state: IReducers) {
  return { dashboard: state.dashboard };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getCategories, getSepdningItems, getUserInfo, postSpendingItem }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);