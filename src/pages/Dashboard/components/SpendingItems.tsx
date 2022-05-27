import React from 'react';

import * as Helpers from '@services/index';
import Api, { Spending, Category, UpdateMutationFn } from '@services/Api';
import GeneralError from '@pages/Errors/GeneralError';
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
      const [_updateDeketeItem, deleteItemMutation] = Api.deleteItem();

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
              {Helpers.roundNumber(item.item_price)}
            </div>
          </div>
          <button
            type="button"
            className={SpendingItemCss['third-column']}
            onClick={() => SpendingItems.#deleteItem(deleteItemMutation as UpdateMutationFn, item.item_uuid)}
          >
            <img src={deleteIcon} alt="Delete Icon" className={GlobalCss['delete-icon']} />
          </button>
        </section>
      ));

      return <>{spendingItems}</>;
    } catch (error) {
      return <GeneralError error={error} />;
    }
  }

  static #categoryNameFromUuid(categories: Category[] | undefined, catUuid: string): string {
    if (typeof categories === 'undefined') {
      throw new Error('category does not exist or has not been selected');
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
    const month = Helpers.monthToText(splitDates[1]);
    const day = splitDates[2];

    return `${day} ${month} ${year}`;
  }

  static async #deleteItem(deleteItemMutation: UpdateMutationFn, itemUuid: string): Promise<void> {
    try {
      const result = await deleteItemMutation({ itemUuid });

      if (result.error) throw new Error(result.error.message);
    } catch (err) {
      console.error(`deleteItem:${err}`);
    }
  }
}

export default SpendingItems.main;
