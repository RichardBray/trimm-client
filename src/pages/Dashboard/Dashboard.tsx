import React, { Component } from 'react';

import Layout from '../../templates/Layout';

// - services
import { IServerResponses, ISpendingItem } from '@services/interfaces';
import { modifyMonth, monthToText, roundNumber, categoryColours } from '@services/index';
import Graphql, { Spending, Categories, User } from '@services/Graphql';
import CategoryTotals from '@services/CategoryTotals';
const calculateCategoryTotals = CategoryTotals.main;

// - components
import SpendingItems from './components/SpendingItems';
import SpendingItemsForm from './components/SpendingItemsForm';
import CategoryDonutGraph from './components/CategoryDonutGraph';

// - styles
import DashboardCss from '@assets/styles/views/Dashboard.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';
import GlobalCss from '@assets/styles/global.module.css';

// - images
import deleteIcon from '@assets/img/delete-icon.svg';
import chevron from '@assets/img/chevron.svg';
import { CombinedError } from 'urql';

type DashboardState = {
  date: DashboardDateInput;
  spending_item: unknown;
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
    data?: {
      categories: Categories[];
      items: Spending[];
      getUser: User;
    };
    fetching?: boolean;
    error?: CombinedError;
  };
};

class Dashboard extends Component<DashboardProps, DashboardState> {
  date = new Date();
  date_year: number = this.date.getFullYear();
  date_month: number = this.date.getMonth() + 1;
  date_day: number = this.date.getDate();

  #defaultSpendingItem: ISpendingItem = {
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
      ...this.#defaultSpendingItem,
    },
    new_category: '',
    user_currency: '',
    categories: {},
    show_welcome: true,
    filter_id: 0,
  };


  renderCategories(): JSX.Element[] | JSX.Element {
    const { data, code } = { data: [], code: 200 };
    const render_categories =
      typeof data !== 'undefined' &&
      data.map((cat: any, index: number) => {
        const catTotal = this.calculateCatTotal(cat.cat_id);

        return (
          <section key={cat.cat_uuid} className={DashboardCss['cat-row']}>
            <div
              className={DashboardCss['cat-color-circle']}
              style={{ backgroundColor: categoryColours()[index] }}
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

  render(): JSX.Element {
    const { data, fetching, error } = this.props.getCategories;
    console.log(data, 'data');

    if (fetching) {
      return Dashboard.#loadingSVG();
    }

    if (error) {
      console.log(error, 'error');
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
            <SpendingItemsForm categoriesData={data?.categories} />
            <SpendingItems
              items={data?.items}
              categories={data?.categories}
              currency={Dashboard.#getCurrencySymbol(data?.getUser.user_currency)}
            />
          </div>
          <div className={DashboardCss['cat-section']}>
            <CategoryDonutGraph
              items={data?.items}
              categories={data?.categories}
              currency={Dashboard.#getCurrencySymbol(data?.getUser.user_currency)}
            />
            {/* {this.renderCategories()} */}
          </div>
        </section>
      </Layout>
    );
  }

  static #getCurrencySymbol(currency: string | undefined): string {
    if (!currency) return '£';

    const split_text = currency?.split('-');
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
   * Gets the Spending items
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

  calculateCatTotal(cat_id: number): number {
    const { cat_totals } = this.props.dashboard;
    let total = 0;
    cat_totals.map((cat: [number, number], index: number) => {
      if (cat_id === cat[0]) {
        total = cat_totals[index][1];
      }
    });

    return total;
  }
}

function addHooksTo(Comp: typeof Dashboard) {
  function CompWithHooks(props: DashboardProps) {
    const getCategories = Graphql.getDashboardData();
    const data = {
      ...props,
      getCategories,
    };

    return <Comp {...data} />;
  }

  return CompWithHooks;
}

export default addHooksTo(Dashboard);
