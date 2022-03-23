import { ISpendingItem } from '../utils/interfaces';
import {
  GET_CATEGORIES_API,
  GET_CATEGORIES,
  GET_SPENDING_ITEMS,
  GET_ITEMS_API,
  GET_USER_API,
  GET_USER,
  ITEM_API,
  POST_SPENDING_ITEM,
  DELETE_ITEM,
  POST_CATEGORY,
  GET_CATEGORY_API,
  DELETE_CATEGORY,
  FILTER_SPENDING_ITEMS,
  UPDATE_CATEGORY_TOTALS,
} from '../utils/constants';
import { modifyMonth } from '../utils';
import Http from '../utils/http';

export function getSpendingItems(monthYear: { month: number; year: number }) {
  const { month, year } = monthYear;
  const monthYearStr = `${year}-${modifyMonth(month)}`;
  const currentDate = `${monthYearStr}-01`;

  const lastDayDate = new Date(year, +modifyMonth(month), 0);

  const dateInfo = {
    start_date: currentDate,
    end_date: `${monthYearStr}-${lastDayDate.getDate()}`,
  };
  return Http.post(GET_ITEMS_API, GET_SPENDING_ITEMS, dateInfo);
}

export function postSpendingItem(itemInfo: ISpendingItem) {
  return Http.post(ITEM_API, POST_SPENDING_ITEM, itemInfo);
}

export function deleteSpendingItem(item_uuid: string) {
  return Http.delete(ITEM_API, DELETE_ITEM, { item_uuid });
}

export function getCategories() {
  return Http.get(GET_CATEGORIES_API, GET_CATEGORIES);
}

export function postNewCategory(cat_name: string) {
  const data = {
    cat_name,
    cat_budget: 0,
  };
  return Http.post(GET_CATEGORY_API, POST_CATEGORY, data);
}

export function deleteCategory(cat_uuid: string) {
  return Http.delete(GET_CATEGORY_API, DELETE_CATEGORY, { cat_uuid });
}

export function getUserInfo() {
  return Http.get(GET_USER_API, GET_USER);
}

export function filterSpendingItems(catID: number) {
  return {
    type: FILTER_SPENDING_ITEMS,
    payload: catID,
  };
}
/**
 * There's probably a better way this could be written
 */
export function updateCategoriesTotal(spendingData: {item_price: number, cat_id: number}[]) {
  const updatedState: number[][] = [];

  typeof spendingData !== 'undefined' &&
    spendingData.map((item: {item_price: number, cat_id: number}) => {
      let nothingAdded = 0;
      updatedState.map((category: number[], index: number) => {
        if (category[0] === item.cat_id) {
          const newPrice = category[1] + item.item_price;
          updatedState.splice(index, 1, [item.cat_id, newPrice]);
        } else {
          nothingAdded += 1;
        }
      });

      if (updatedState.length === 0 || nothingAdded === updatedState.length) {
        updatedState.push([item.cat_id, item.item_price]);
      }
    });

  return {
    type: UPDATE_CATEGORY_TOTALS,
    payload: updatedState,
  };
}
