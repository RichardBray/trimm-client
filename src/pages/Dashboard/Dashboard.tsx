import React, { Component } from 'react';
import { CombinedError } from 'urql';

import Layout from '../../templates/Layout';

// - services
import { ISpendingItem } from '@services/interfaces';
import { modifyMonth, monthToText } from '@services/index';
import Graphql, { Spending, Categories, User } from '@services/Graphql';

// - components
import SpendingItems from './components/SpendingItems';
import SpendingItemsForm from './components/SpendingItemsForm';
import CategoryDonutGraph from './components/CategoryDonutGraph';
import CategoriesList from './components/CategoriesList';

// - styles
import DashboardCss from '@assets/styles/views/Dashboard.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';

// - images
import chevron from '@assets/img/chevron.svg';

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

  render(): JSX.Element {
    const { data, fetching, error } = this.props.getCategories;
    console.log(data, 'data');

    if (!data) {
      console.error('no data found');
    }

    if (fetching) {
      return Dashboard.#loadingSVG();
    }

    if (error) {
      console.log(error, 'error');
    }

    const userCurrency = Dashboard.#getCurrencySymbol(data?.getUser.user_currency);

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
              currency={userCurrency}
            />
          </div>
          <div className={DashboardCss['cat-section']}>
            <CategoryDonutGraph
              items={data?.items}
              categories={data?.categories}
              currency={userCurrency}
            />
            <CategoriesList
              items={data?.items}
              categories={data?.categories}
              currency={userCurrency}
            />
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

  #changeMonth(next = false) {
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

    this.setState({ date: newStateDate });
    this.setState({ filter_id: 0 });
    this.setState({ spending_item: { ...this.state.spending_item, create_dttm: newDate } });
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
