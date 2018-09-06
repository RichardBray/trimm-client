import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Doughnut } from 'react-chartjs-2';
import { getCategories, getSpendingItems, getUserInfo, postSpendingItem, postNewCategory, deleteCategory, updateCategoriesTotal } from "../actions/DashboardActions";

import { IDashvoardView, IReducers, IAction, IDashboardState, IServerResponses, ISpendingItem, IDashboardDate } from "../utils/interfaces";
import Layout from "../components/Layout";
import SpendingItems from "../components/SpendingItems";
import { modifyMonth, monthToText, gaEvent } from "../utils";

// Styles
import Inputs from "~/assets/styles/components/Inputs";
import Buttons from "~/assets/styles/components/Buttons";
import DashboardCss from "~/assets/styles/views/Dashboard";
import HelpersCss from "~/assets/styles/helpers";
import GlobalCss from "~/assets/styles/global";

// Images
import deleteIcon from "~/assets/img/delete-icon.svg";
import chevron from "~/assets/img/chevron.svg";


class Dashboard extends Component<IDashvoardView, IDashboardState> {

  date = new Date();
  date_year: number = this.date.getFullYear();
  date_month: number = this.date.getMonth() + 1;
  date_day: number = this.date.getDate();

  static graph_options = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    hover: { 
      mode: null 
    },
    maintainAspectRatio: true,
    cutoutPercentage: 65,
    responsive: false,
  };

  static cat_colours: Array<string> = [ // 10 Colours
    '#8DE1FE',
    '#897ACC',
    '#F9BB82',
    '#F3A2B9',
    '#B9E185',
    '#EDEF78',
    '#DFA2F3',
    '#A2BEF3',
    '#F3A2A2',
    '#C2C2C2'
  ];

  default_spending_item: ISpendingItem = {
    item_name: "",
    item_price: 0,
    create_dttm: `${this.date_year}-${modifyMonth(this.date_month)}-${modifyMonth(this.date_day)}`,
    cat_id: "0"
  };

  state = {
    date: {
      month: this.date_month,
      year: this.date_year
    },
    spending_item: {
      ...this.default_spending_item
    },
    new_category: "",
    data_loaded: false,
    user_currency: "",
    categories: {},
    show_welcome: true
  }

  /**
   * Get all the data needed for this page.
   */
  async componentDidMount(): Promise<void> {
    await this.props.getCategories();
    await this.updateSpendingSection();
    await this.props.getUserInfo(); 
    this.setState({ data_loaded: true });
    this.setState({ 
      user_currency: 
      Dashboard._getCurrencySymbol(this.props.dashboard.user_info.user_currency)
    });
  }

  async updateSpendingSection(dateRange?: IDashboardDate): Promise<void> {
    await this.props.getSpendingItems(dateRange ? dateRange: this.state.date); 
    await this.props.updateCategoriesTotal(this.props.dashboard.spending_items.data);  
  }

  /**
   * I've taken out the budget functionality for this version
   */
  renderCategories(): JSX.Element[] | JSX.Element {
    const { data, code } = this.props.dashboard.categories;
    const render_categories = (typeof (data) !== "undefined") && data.map((cat: any, index: number) => {
    let catTotal = this._calculateCatTotal(cat.cat_id);
  
    return (
      <section 
        key={cat.cat_uuid}
        className={DashboardCss['cat-row']} 
      >
        <div 
          className={DashboardCss['cat-color-circle']}
          style={ { backgroundColor: Dashboard.cat_colours[index]} } 
        />
        <section className={DashboardCss['cat-row__text']}>
          <div>{cat.cat_name}</div>
          <div className={DashboardCss['cat-row__price']}>
            {this.state.user_currency}{catTotal}</div>
          <img
            src={deleteIcon}
            className={GlobalCss['delete-icon']}
            alt="Delete Icon"
            onClick={() => this._deleteCategory(cat.cat_uuid, cat.cat_id)} />
        </section>
      </section>
    )}
    );

    const add_category = (no_categories: boolean = true) => { 
      return (
        <form 
          className={HelpersCss['dis-f']}
          onSubmit={(e) => this._handleAddCategory(e)}>
          {no_categories && "You have no categories 😢"} 
          <input 
            type="text" 
            name="new_category"
            className={DashboardCss['cat-form__input']}
            placeholder="e.g. Chocolate fund"
            value={this.state.new_category} 
            onChange={e => this._handleChange(e, false)} 
            required
          />
          <button 
            type="submit"
            className={DashboardCss['cat-form__submit']}> 
            Add category
          </button>
        </form>
      );
    }

    function categoriesAndNewForm() {
      return (
        <div className={DashboardCss['cat-container']}>
          {add_category(false)}
          {render_categories}
        </div>
      )
    }

    const responses: IServerResponses = {
      200: categoriesAndNewForm(),
      404: add_category(),
      401: <div>Looks like you are somewhere you shouldn't be 🚫</div>
    }
    
    return responses[code];
  }

  renderSpendingForm(): JSX.Element {
    const { categories } = this.props.dashboard;
    const { item_name, create_dttm, item_price } = this.state.spending_item;
    const category_list = categories.code === 200 && categories.data.map((cat: any) => (
        <option 
          key={cat.cat_id} 
          value={cat.cat_id}>
            {cat.cat_name}
        </option>
      )
    );

    return (
      <form className={DashboardCss['spending-form']} onSubmit={(e: any) => this._addSpendingItem(e)}>
        <section className={`${HelpersCss['w-70']} dis-f`}>
          <div className={DashboardCss['spending-form__text']}>
            <label 
              htmlFor="cat_id"
              className={DashboardCss['spending-form__text_box']}
            >Category:</label>
            <label 
              htmlFor="item_name"
              className={DashboardCss['spending-form__text_box']}
            >Description:</label>  
            <label 
              htmlFor="create_dttm"
              className={DashboardCss['spending-form__text_box']}
            >Date:</label>  
          </div>
          <div className={DashboardCss['spending-form__inputs']}>
            <select
              name="cat_id"
              value={this.state.spending_item.cat_id}
              className={Inputs['input-spending-form']}
              onChange={e => this._handleChange(e)}
              required>
              <option value="0" disabled>--</option>
              {category_list}
            </select> 
            <input
              type="text"
              name="item_name"
              placeholder="Description"
              className={Inputs['input-spending-form']}
              value={item_name}
              onChange={e => this._handleChange(e)}
              required
            />   
            <input
              type="date"
              name="create_dttm"
              placeholder="Date"
              className={Inputs['input-spending-form']}
              onChange={e => this._handleChange(e)}
              value={create_dttm}
            />                      
          </div>               
        </section>
        <section className={HelpersCss['w-30']}>
          <input
            type="number"
            name="item_price"
            placeholder="Price"
            className={Inputs['input-spending-form-price']}
            value={item_price}
            onChange={e => this._handleChange(e)}
            required
          />                          
          <button type="submit" className={Buttons['primary-btn']}>Add Item</button>
        </section>
      </form>
    )
  }

  renderCategoryGraph() {
    return (
      <section>
        <Doughnut
          height={500}
          width={400}
          data={this._graph_data()} options={Dashboard.graph_options} />
        <h2 
          className={DashboardCss['spending-total']}>
          {this.state.user_currency}
          {Dashboard._calculateSpendingTotal(this.props.dashboard.spending_items.data)}
        </h2>
      </section>      
    );
  }

  renderWelcomeMessage() {
    return (!document.cookie.includes('welcome_clicked=')) && (
      <section className={this.state.show_welcome ? DashboardCss['welcome-message']: "dis-n" }>
        <div>
          <h1 className={DashboardCss['welcome-title']}>Welcome to Trimm, 👋</h1>
          <p>
            Trimm is a site that makes it easy to keep track of how much you spend every month. 
            This is a very very early version of the site and I'm really open to any feedback you have,
            so if you spot any bugs or have anything nice to say, click on the message icon on the bottom right of the screen and type away.
          </p>
          Have fun :)<br/>
          <em>Richard</em>
        </div>
        <div 
          className={DashboardCss['welcome-close']}
          onClick={() => this._addWelcomeCookie()}>
          &times;
        </div>
      </section>
    );
  }

  render(): JSX.Element {
    const spendingItems = this.props.dashboard.spending_items;
  
    if (this.state.data_loaded) {
      return (
        <Layout>
          {this.renderWelcomeMessage()}
          <section className={DashboardCss['month-change']}>
            <div 
              className={DashboardCss['month-change__btn']} 
              onClick={() => this._changeMonth()}
            >
              <img
                className={HelpersCss['trsf-180deg']}
                src={chevron}
                alt="Next month"
              />             
              {monthToText(this.state.date.month - 1)}             
            </div>
            <h2 className={DashboardCss['month-header']}>{monthToText(this.state.date.month)} {this.state.date.year}</h2>
            <div 
              className={DashboardCss['month-change__btn']} 
              onClick={() => this._changeMonth(true)}
            >
              {monthToText(this.state.date.month + 1)}
              <img
                src={chevron}
                alt="Next month"
              />              
            </div>
          </section>
          <section className={DashboardCss.container}>
            <div className="w-50">
              {this.renderSpendingForm()}
              <SpendingItems 
                code={spendingItems.code} 
                data={spendingItems.data}
                dateRange={this.state.date}
                currency={this.state.user_currency}
              />
            </div>
            <div className={DashboardCss['cat-section']}>
              {this.renderCategoryGraph()}
              {this.renderCategories()}
            </div>            
          </section>
        </Layout>
      )      
    }
    return Dashboard._loadingSVG()
  }
  
  private static _calculateSpendingTotal(data: any): number {
    let total = 0;
    (typeof (data) !== "undefined") && data.map((item: any) => {
      total += item.item_price;
    });
    return total;
  }

  private static _getCurrencySymbol(currency: string): string {
    const split_text = currency.split(" ");
    return split_text[0];
  }

  private static _loadingSVG() {
    return (
      <div title="1">
        <svg id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          width="40" height="40" viewBox="0 0 50 50">
          <path d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
            <animateTransform attributeType="xml" attributeName="transform" type="rotate"
              from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
    )
  }

  /**
   * Generates data for the Doughnut graph
   */
  private _graph_data(): any {
    let graph_labels: Array<string> = [];
    let graph_totals: Array<number> = [];
    const { data } = this.props.dashboard.categories;

    (typeof (data) !== "undefined") && data.map((cat: any, index: number) => {
      const catTotal = this._calculateCatTotal(cat.cat_id);
      graph_labels.push(cat.cat_name);
      graph_totals.push(catTotal);
    })

    return {
      labels: graph_labels,
      datasets: [{
        data: graph_totals,
        backgroundColor: Dashboard.cat_colours
      }]
    }
  }

  /**
   * If a category hasn't been selected don't
   * send an api request, and if the return code is not
   * 201 then tell the user something went wrong.
   */
  private async _addSpendingItem(e: any): Promise<void> {
    e.preventDefault();
    if (this.state.spending_item.cat_id !== "0") {
      await this.props.postSpendingItem(this.state.spending_item);
      if (this.props.dashboard.new_spending_item.code === 201) {
        await this.updateSpendingSection();
        gaEvent('Add Item - Success'); 
      } else {
        gaEvent('Add Item - Error'); 
        console.error('something has gone wrong'); // TODO change this at some point
      }
      this.setState({ spending_item: this.default_spending_item });
    } else {
      gaEvent('Add Item - Forgot Category');
      alert("Please select a category");
    }
  };

  private _handleChange(e: any, spending_item: boolean = true): void {
    const spendingState: any = {
      spending_item: {
        ...this.state.spending_item,
        [e.target.name]: e.target.value
      }
    };

    this.setState(spending_item ? spendingState : {[e.target.name]: e.target.value});
  };

  /**
   * Gets the spending items
   * for the following month.
   * @param next If it's next or prev
   */
  private _changeMonth(next: boolean = false): void {
    const {month, year} = this.state.date;
    const chosenDate = new Date(`${year}-${month}-01`);
    const monthChange = next ? chosenDate.getMonth() +1 : chosenDate.getMonth() -1;
    chosenDate.setMonth(monthChange);

    const newStateDate = {
      month: chosenDate.getMonth() +1,
      year: chosenDate.getFullYear()
    };

    const stateDay = this.state.spending_item.create_dttm.split('-')[2]
    const newDate: string = `${newStateDate.year}-${modifyMonth(newStateDate.month)}-${stateDay}`;

    this.updateSpendingSection(newStateDate);
    this.setState({ date: newStateDate });
    this.setState({ spending_item: { ...this.state.spending_item, create_dttm: newDate}});
    gaEvent('Month Changed - Sucess');
  };

  private async _handleAddCategory(e: any): Promise<void> {
    e.preventDefault();
    await this.props.postNewCategory(this.state.new_category);
    const { code, message } = this.props.dashboard.new_category;
    if (this.props.dashboard.categories.data.length <= 10) {
      if (code === 400) {
        gaEvent('Add Category - Error');
        alert(`${message}`);
      } else {
        this.setState({new_category: ""});
        this.props.getCategories();
        gaEvent('Add Category - Success');
      }
    } else {
      gaEvent('Add Category - Limit Reached');
      alert('Sorry you have hit the catgory limit');
    }
  };

  private async _deleteCategory(cat_uuid: string, cat_id: number): Promise<void> {
    let cat_has_total = false;
    this.props.dashboard.cat_totals.map((cat_total:[number, number]) => {
      if (cat_total[0] === cat_id && cat_total[1] !== 0) {
        cat_has_total = true;
      }
    });

    if (!cat_has_total) {
      gaEvent('Delete Category - Success');
      await this.props.deleteCategory(cat_uuid);
      await this.props.getCategories();      
    } else {
      gaEvent('Delete Category - Error');
      alert('This category is in use');
    }
  
  };  

  private _calculateCatTotal(cat_id: number): number {
    const { cat_totals } = this.props.dashboard;
    let total = 0;
    cat_totals.map((cat: [number, number], index: number) => {
      if (cat_id === cat[0]) {
        total = cat_totals[index][1];
      }
    });

    return total;
  };

  private _addWelcomeCookie(): any {
    document.cookie = "welcome_clicked=true";
    this.setState({ show_welcome: false });
  }
 
}

function mapStateToProps(state: IReducers) {
  return { dashboard: state.dashboard };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getCategories, getSpendingItems, getUserInfo, postSpendingItem, postNewCategory, deleteCategory, updateCategoriesTotal }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);