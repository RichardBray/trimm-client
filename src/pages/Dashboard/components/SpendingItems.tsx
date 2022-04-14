import React from 'react';

import { monthToText, roundNumber } from '@services/index';
import { spending, categories } from '@services/Graphql';

// - styles
import SpendingItemCss from '@assets/styles/components/SpendingItems.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';
import GlobalCss from '@assets/styles/global.module.css';

// - images
import deleteIcon from '@assets/img/delete-icon.svg';

type SpendingItemsProps = {
  items: spending[] | undefined;
  categories: categories[] | undefined;
  currency: string | undefined;
};
class SpendingItems {
  static main(props: SpendingItemsProps): JSX.Element[] | JSX.Element {
    const { items } = props;
    const dataDoesNotExist = typeof items === 'undefined' || items?.length === 0;

    if (dataDoesNotExist) {
      return <div className={SpendingItemCss['no-items']}>You have no items for this month 😢</div>;
    }

    return items.map((item: spending) => (
      <section key={item.item_uuid} className={SpendingItemCss.container}>
        <div className={SpendingItemCss['first-column']}>
          <div className={SpendingItemCss['cat-title']}>{SpendingItems.#categoryNameFromUuid(props?.categories, item.cat_uuid)}</div>
          <div>{item.item_name}</div>
        </div>
        <div className={SpendingItemCss['second-column']}>
          <div className={HelpersCss['mb-1rem']}>{SpendingItems.#formatDate(item.create_dttm)}</div>
          <div className={SpendingItemCss['price-text']}>
            {props.currency}
            {roundNumber(item.item_price)}
          </div>
        </div>
        <div className={SpendingItemCss['third-column']}>
          <img
            src={deleteIcon}
            alt="Delete Icon"
            className={GlobalCss['delete-icon']}
            onClick={() => SpendingItems.#deleteItem(item.item_uuid)}
          />
        </div>
      </section>
    ));
  }

  static #categoryNameFromUuid(categories: categories[] | undefined, catUuid: string): string {
    if (typeof categories === 'undefined') {
      return '';
    }
    const selectedCategory = categories.find(category => category.cat_uuid === catUuid) as categories;

    return selectedCategory.cat_name;
  }

  static #formatDate(date: Date) {
    const splitTime = String(date).split('T');
    const splitDates = splitTime[0].split('-');
    const year = splitDates[0];
    const month = monthToText(splitDates[1]);
    const day = splitDates[2];

    return `${day} ${month} ${year}`;
  }

  /**
   * Should be graphql mutation
   */
  static #deleteItem(item_uuid: string): Promise<void> {}
}

export default SpendingItems.main;
