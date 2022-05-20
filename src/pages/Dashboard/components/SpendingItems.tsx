import React from 'react';

import { monthToText, roundNumber } from '@services/index';
import Api, { Spending, Category } from '@services/Api';

// - styles
import SpendingItemCss from '@assets/styles/components/SpendingItems.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';
import GlobalCss from '@assets/styles/global.module.css';

// - images
import deleteIcon from '@assets/img/delete-icon.svg';

type SpendingItemsProps = {
  items: Spending[] | undefined;
  categories: Category[] | undefined;
  currency: string | undefined;
};
class SpendingItems {
  static main(props: SpendingItemsProps) {
    try {
      const { items } = props;
      const dataDoesNotExist = typeof items === 'undefined' || items?.length === 0;

      if (dataDoesNotExist) {
        return <div className={SpendingItemCss['no-items']}>You have no items for this month 😢</div>;
      }

      const spendingItems = items.map((item: Spending) => (
        <section key={item.item_uuid} className={SpendingItemCss.container}>
          <div className={SpendingItemCss['first-column']}>
            <div className={SpendingItemCss['cat-title']}>
              {SpendingItems.#categoryNameFromUuid(props?.categories, item.cat_uuid)}
            </div>
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

      return <>{spendingItems}</>;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static #categoryNameFromUuid(categories: Category[] | undefined, catUuid: string): string {
    if (typeof categories === 'undefined') {
      return '';
    }

    const selectedCategory = categories.find((category) => category.cat_uuid === catUuid);

    if (!selectedCategory) {
      throw new Error(`categoryNameFromUuid: category with uuid ${catUuid} not found`);
    }

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

  static async #deleteItem(item_uuid: string): Promise<void> {
    try {
      const result = await Api.deleteItem(item_uuid);

      if (result.error) throw new Error(result.error.message);
    } catch (err) {
      console.error(err);
    }
  }
}

export default SpendingItems.main;
