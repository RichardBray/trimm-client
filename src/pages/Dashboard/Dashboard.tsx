import React, { Component, useContext } from 'react';
import { CombinedError } from 'urql';

import Layout from '@templates/Layout';

import * as Helpers from '@services/index';

// - services
import { GlobalStore, DispatchActionTypes, GlobalStoreOutput } from '@services/GlobalStore';
import { monthToText } from '@services/index';
import Api, { Spending, Category, User, ItemsDateRange } from '@services/Api';

// - components
import SpendingItems from '@pages/Dashboard/components/SpendingItems';
import SpendingItemsForm from '@pages/Dashboard/components/SpendingItemsForm';
import CategoryDonutGraph from '@pages/Dashboard/components/CategoryDonutGraph';
import CategoriesList from '@pages/Dashboard/components/CategoriesList';

// - styles
import DashboardCss from '@assets/styles/views/Dashboard.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';

// - images
import chevron from '@assets/img/chevron.svg';

type DashboardState = {
  date: DashboardDateInput;
};

type DashboardDateInput = {
  month: number | undefined;
  year: number | undefined;
};

type DashboardProps = {
  getCategories?: {
    data?: {
      categories: Category[];
      items: Spending[];
      getUser: User;
    };
    fetching?: boolean;
    error?: CombinedError;
  };
  globalStore?: GlobalStoreOutput;
  currentMonth?: string;
  currentYear?: number;
};

class Dashboard extends Component<DashboardProps, DashboardState> {

  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      date: {
        month: Number(props?.currentMonth),
        year: props?.currentYear,
      },
    };
    }

  render(): JSX.Element {
    const { data, fetching, error } = this.props?.getCategories ?? {};

    if (fetching) {
      return Dashboard.#loadingSVG();
    }

    if (error) {
      console.error(error, 'error');
    }

    const userCurrency = Dashboard.#getCurrencySymbol(data?.getUser.user_currency);

    return (
      <Layout>
        <header className={DashboardCss['month-change']}>
          <div
            className={DashboardCss['month-change__btn']}
            onClick={() => this.#changeMonth(false, this.props.globalStore)}
          >
            <img className={HelpersCss['trsf-180deg']} src={chevron} alt="Next month" />
            {monthToText(this.state.date.month as number - 1)}
          </div>
          <h2 className={DashboardCss['month-header']}>
            {monthToText(this.state.date.month as number)} {this.state.date.year}
          </h2>
          <div
            className={DashboardCss['month-change__btn']}
            onClick={() => this.#changeMonth(true, this.props.globalStore)}
          >
            {monthToText(this.state.date.month as number + 1)}
            <img src={chevron} alt="Next month" />
          </div>
        </header>
        <section className={DashboardCss.container}>
          <div className="w-50">
            <SpendingItemsForm categoriesData={data?.categories} />
            <SpendingItems items={data?.items} categories={data?.categories} currency={userCurrency} />
          </div>
          <div className={DashboardCss['cat-section']}>
            <CategoryDonutGraph items={data?.items} categories={data?.categories} currency={userCurrency} />
            <CategoriesList items={data?.items} categories={data?.categories} currency={userCurrency} />
          </div>
        </section>
      </Layout>
    );
  }

  static #getCurrencySymbol(currency?: string): string {
    if (!currency) return '£';
    const [currencySymbol] = currency?.split('-');

    return currencySymbol;
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

  #changeMonth(showNextMonth = false, globalStore?: GlobalStoreOutput) {
    const { month, year } = this.state.date;
    const chosenDate = new Date(`${year}-${month}-01`);
    const prevOrNextMonth = showNextMonth ? chosenDate.getMonth() + 1 : chosenDate.getMonth() - 1;

    chosenDate.setMonth(prevOrNextMonth);

    const updatedValues = {
      month: chosenDate.getMonth() + 1,
      year: chosenDate.getFullYear(),
    };

    globalStore?.dispatch({
      type: DispatchActionTypes.addDateRange,
      payload: {
        startDate: Dashboard.#calculateNewStartDate(chosenDate),
        endDate: Dashboard.#calculateNewEndDate(chosenDate),
      },
    });

    this.setState({ date: updatedValues });
  }

  static #calculateNewStartDate(changedDate: Date) {
    changedDate.setMonth(changedDate.getMonth() - 1);
    return Dashboard.#calculateNewDate(changedDate);
  }

  static #calculateNewDate(changedDate: Date) {
    const year = changedDate.getFullYear();
    const month = Helpers.addZeroIfSingleNumber(changedDate.getMonth() + 1);

    return `${year}-${month}-01`;

  }

  static #calculateNewEndDate(changedDate: Date) {
    changedDate.setMonth(changedDate.getMonth() + 1);
    return Dashboard.#calculateNewDate(changedDate);
  }
}

function addHooksTo(Comp: typeof Dashboard) {
  function CompWithHooks(props: DashboardProps) {
    const globalStore = useContext(GlobalStore);
    const getCategories = Api.getDashboardData(globalStore?.state.dateRange as ItemsDateRange);

    const data = {
      ...props,
      getCategories,
      globalStore,
      currentYear: Helpers.initialDateValues().currentYear,
      currentMonth: Helpers.initialDateValues().currentMonth,
    };

    return <Comp {...data} />;
  }

  return CompWithHooks;
}

export default addHooksTo(Dashboard);
