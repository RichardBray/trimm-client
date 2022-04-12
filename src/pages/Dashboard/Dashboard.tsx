import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { IServerResponses, ISpendingItem } from '../../services/interfaces';
import Layout from '../../templates/Layout';
import SpendingItems from './components/SpendingItems';
import { modifyMonth, monthToText, roundNumber } from '../../services';
import Graphql from '../../services/Graphql';

// Styles
import Inputs from '@assets/styles/components/Inputs.module.css';
import Buttons from '@assets/styles/components/Buttons.module.css';
import DashboardCss from '@assets/styles/views/Dashboard.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';
import GlobalCss from '@assets/styles/global.module.css';

// Images
import deleteIcon from '@assets/img/delete-icon.svg';
import chevron from '@assets/img/chevron.svg';
import { ChartOptions } from 'chart.js';
import { CombinedError } from 'urql';

type DashboardState = {
  date: DashboardDateInput;
  spending_item: any;
  new_category: string;
  user_currency: string;
  categories: Record<string, unknown>;
  show_welcome: boolean;
  filter_id: number;
};

type DashboardDateInput = {
  month: number;
  year: number;
};

type DashboardProps = {
  getCategories: {
    data?: Record<string, object>,
    fetching?: boolean,
    error?: CombinedError
  }
};

class Dashboard extends Component<DashboardProps, DashboardState> {
  date = new Date();
  date_year: number = this.date.getFullYear();
  date_month: number = this.date.getMonth() + 1;
  date_day: number = this.date.getDate();

  static #graphOptions = {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    hover: {
      mode: 'x',
    },
    maintainAspectRatio: true,
    cutoutPercentage: 65,
    responsive: false,
  } as ChartOptions;

  static catColours: string[] = [
    // 10 Colours
    '#8DE1FE',
    '#897ACC',
    '#F9BB82',
    '#F3A2B9',
    '#B9E185',
    '#EDEF78',
    '#DFA2F3',
    '#A2BEF3',
    '#F3A2A2',
    '#C2C2C2',
  ];

  default_spending_item: ISpendingItem = {
    item_name: '',
    item_price: 0,
    create_dttm: `${this.date_year}-${modifyMonth(this.date_month)}-${modifyMonth(this.date_day)}`,
    cat_id: '0',
  };

  state = {
    date: {
      month: this.date_month,
      year: this.date_year,
    },
    spending_item: {
      ...this.default_spending_item,
    },
    new_category: '',
    user_currency: '',
    categories: {},
    show_welcome: true,
    filter_id: 0,
  };

  /**
   * I've taken out the budget functionality for this version
   */
  renderCategories(): JSX.Element[] | JSX.Element {
    // const { data, code } = this.props.dashboard.categories;
    const { data, code } = {data: [], code: 200};
    const render_categories =
      typeof data !== 'undefined' &&
      data.map((cat: any, index: number) => {
        const catTotal = this.#calculateCatTotal(cat.cat_id);

        return (
          <section key={cat.cat_uuid} className={DashboardCss['cat-row']}>
            <div
              className={DashboardCss['cat-color-circle']}
              style={{ backgroundColor: Dashboard.catColours[index] }}
            />
            <section className={DashboardCss['cat-row__text']}>
              <div
                className={this.state.filter_id === cat.cat_id ? DashboardCss['cat-row__name'] : HelpersCss['cur-p']}
                onClick={() => this.filterSpendingItems(cat.cat_id)}
              >
                {cat.cat_name}
              </div>
              <div className={DashboardCss['cat-row__price']}>
                {this.state.user_currency}
                {roundNumber(catTotal)}
              </div>
              <img
                src={deleteIcon}
                className={GlobalCss['delete-icon']}
                alt="Delete Icon"
                onClick={() => this.#deleteCategory(cat.cat_uuid, cat.cat_id)}
              />
            </section>
          </section>
        );
      });

    const add_category = (no_categories = true) => {
      return (
        <form className={HelpersCss['dis-f']} onSubmit={(e) => this._handleAddCategory(e)}>
          {no_categories && 'You have no categories 😢'}
          <input
            type="text"
            name="new_category"
            className={DashboardCss['cat-form__input']}
            placeholder="e.g. Chocolate fund"
            value={this.state.new_category}
            onChange={(e) => this.#handleChange(e, false)}
            required
          />
          <button type="submit" className={DashboardCss['cat-form__submit']}>
            Add category
          </button>
        </form>
      );
    };

    function categoriesAndNewForm() {
      return (
        <>
          <div className={DashboardCss['tip-text']}>
            Tip, click on a category name below to see items form it. <br /> Click on it again to siable filtering.
          </div>
          <div className={DashboardCss['cat-container']}>
            {add_category(false)}
            {render_categories}
          </div>
        </>
      );
    }

    const responses: IServerResponses = {
      200: categoriesAndNewForm(),
      404: add_category(),
      401: <div>Looks like you are somewhere you shouldn&apos;t be 🚫</div>,
    };

    return responses[code];
  }

  filterSpendingItems(catID: number) {
    const filter_id = this.state.filter_id === catID ? 0 : catID;
    this.setState({ filter_id });
    // this.props.filterSpendingItems(filter_id);
  }

  renderSpendingForm(): JSX.Element {
    const { categories } = {categories: {data: [], code: 200}}
    const { item_name, create_dttm, item_price } = this.state.spending_item;
    const category_list =
      categories.code === 200 &&
      categories.data.map((cat: any) => (
        <option key={cat.cat_id} value={cat.cat_id}>
          {cat.cat_name}
        </option>
      ));

    return (
      <form className={DashboardCss['spending-form']} onSubmit={(e: any) => this._addSpendingItem(e)}>
        <section className={`${HelpersCss['w-70']} dis-f`}>
          <div className={DashboardCss['spending-form__text']}>
            <label htmlFor="cat_id" className={DashboardCss['spending-form__text_box']}>
              Category:
            </label>
            <label htmlFor="item_name" className={DashboardCss['spending-form__text_box']}>
              Description:
            </label>
            <label htmlFor="create_dttm" className={DashboardCss['spending-form__text_box']}>
              Date:
            </label>
          </div>
          <div className={DashboardCss['spending-form__inputs']}>
            <select
              name="cat_id"
              value={this.state.spending_item.cat_id}
              className={Inputs['input-spending-form']}
              onChange={(e) => this.#handleChange(e)}
              required
            >
              <option value="0" disabled>
                --
              </option>
              {category_list}
            </select>
            <input
              type="text"
              name="item_name"
              placeholder="Description"
              className={Inputs['input-spending-form']}
              value={item_name}
              onChange={(e) => this.#handleChange(e)}
              required
            />
            <input
              type="date"
              name="create_dttm"
              placeholder="Date"
              className={Inputs['input-spending-form']}
              onChange={(e) => this.#handleChange(e)}
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
            onChange={(e) => this.#handleChange(e)}
            required
          />
          <button type="submit" className={Buttons['primary-btn']}>
            Add Item
          </button>
        </section>
      </form>
    );
  }

  renderCategoryGraph() {
    return (
      <section>
        <Doughnut height={500} width={400} data={this.#graph_data()} options={Dashboard.#graphOptions} />
        <h2 className={DashboardCss['spending-total']}>
          {this.state.user_currency}
          {Dashboard.#calculateSpendingTotal(this.state.apiData.items)}
        </h2>
      </section>
    );
  }

  render(): JSX.Element {
    const { data, fetching, error } = this.props.getCategories;
    console.log(data, 'data');
    if (error) {
      console.log(error, 'error')
    }
    const spendingItems = {data: [], code: 200};

    if (fetching) {
      return Dashboard.#loadingSVG();
    }

    return (
      <Layout>
        <header className={DashboardCss['month-change']}>
          <div className={DashboardCss['month-change__btn']} onClick={() => this.#changeMonth()}>
            <img className={HelpersCss['trsf-180deg']} src={chevron} alt="Next month" />
            {monthToText(this.state.date.month - 1)}
          </div>
          <h2 className={DashboardCss['month-header']}>
            {monthToText(this.state.date.month)} {this.state.date.year}
          </h2>
          <div className={DashboardCss['month-change__btn']} onClick={() => this.#changeMonth(true)}>
            {monthToText(this.state.date.month + 1)}
            <img src={chevron} alt="Next month" />
          </div>
        </header>
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
    );

  }

  static #calculateSpendingTotal(data: Record<string, number>[]): number {
    let total = 0;

    typeof data !== 'undefined' &&
      data.map((item: Record<string, number>) => {
        total += item.item_price;
      });
    return roundNumber(total);
  }

  static #getCurrencySymbol(currency: string): string {
    const split_text = currency.split(' ');
    return split_text[0];
  }

  static #loadingSVG() {
    return (
      <div title="1">
        <svg
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="40"
          height="40"
          viewBox="0 0 50 50"
        >
          <path d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    );
  }

  /**
   * Generates data for the Doughnut graph
   */
  #graph_data() {
    const graph_labels: string[] = [];
    const graph_totals: number[] = [];
    const data = this.state.apiData.categories;

    typeof data !== 'undefined' &&
      data.map((cat: Record<string, unknown>) => {
        const catTotal = this.#calculateCatTotal(cat.cat_id as number);
        graph_labels.push(cat.cat_name as string);
        graph_totals.push(catTotal);
      });

    return {
      labels: graph_labels,
      datasets: [
        {
          data: graph_totals,
          backgroundColor: Dashboard.catColours,
          borderColor: '#f8f8f8',
        },
      ],
    };
  }

  /**
   * If a category hasn't been selected don't
   * send an api request, and if the return code is not
   * 201 then tell the user something went wrong.
   */
  private async _addSpendingItem(e: Event): Promise<void> {
    e.preventDefault();
    if (this.state.spending_item.cat_id !== '0') {
      this.setState({ spending_item: this.default_spending_item });
    } else {
      alert('Please select a category');
    }
  }

  #handleChange(e: any, spending_item = true): void {
    const spendingState: any = {
      spending_item: {
        ...this.state.spending_item,
        [e.target.name]: e.target.value,
      },
    };

    this.setState(spending_item ? spendingState : { [e.target.name]: e.target.value });
  }

  /**
   * Gets the spending items
   * for the following month.
   * @param next If it's next or prev
   */
  #changeMonth(next = false): void {
    const { month, year } = this.state.date;
    const chosenDate = new Date(`${year}-${month}-01`);
    const monthChange = next ? chosenDate.getMonth() + 1 : chosenDate.getMonth() - 1;
    chosenDate.setMonth(monthChange);

    const newStateDate = {
      month: chosenDate.getMonth() + 1,
      year: chosenDate.getFullYear(),
    };

    const stateDay = this.state.spending_item.create_dttm.split('-')[2];
    const newDate = `${newStateDate.year}-${modifyMonth(newStateDate.month)}-${stateDay}`;

    // this.updateSpendingSection(newStateDate);
    this.setState({ date: newStateDate });
    this.setState({ filter_id: 0 });
    this.setState({ spending_item: { ...this.state.spending_item, create_dttm: newDate } });
  }

  private async _handleAddCategory(e: any): Promise<void> {
    e.preventDefault();
    await this.props.postNewCategory(this.state.new_category);
    const { code, message } = this.props.dashboard.new_category;
    if (this.props.dashboard.categories.data.length <= 10) {
      if (code === 400) {
        // alert(`${message}`);
      } else {
        this.setState({ new_category: '' });
        // this.props.getCategories();
      }
    } else {
      alert('Sorry you have hit the catgory limit');
    }
  }

  async #deleteCategory(cat_uuid: string, cat_id: number): Promise<void> {
    let cat_has_total = false;
    this.props.dashboard.cat_totals.map((cat_total: [number, number]) => {
      if (cat_total[0] === cat_id && cat_total[1] !== 0) {
        cat_has_total = true;
      }
    });

    if (!cat_has_total) {
      // await this.props.deleteCategory(cat_uuid);
      // await this.props.getCategories();
    } else {
      alert('This category is in use');
    }
  }

  #calculateCatTotal(cat_id: number): number {
    const { cat_totals } = this.props.dashboard;
    let total = 0;
    cat_totals.map((cat: [number, number], index: number) => {
      if (cat_id === cat[0]) {
        total = cat_totals[index][1];
      }
    });

    return total;
  }

  #addWelcomeCookie() {
    document.cookie = 'welcome_clicked=true';
    this.setState({ show_welcome: false });
  }
}

function addHooksTo(Comp: typeof Dashboard) {
  function CompWithHooks(props: DashboardProps) {
    const getCategories = Graphql.getCategories();
    const data = {
      ...props,
      getCategories
    }

    return <Comp {...data} />;
  }

  return CompWithHooks;
}

export default addHooksTo(Dashboard);
