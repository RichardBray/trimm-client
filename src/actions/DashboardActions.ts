/* global fetch */
import {  ISpendingDate, ISpendingItem } from '../utils/interfaces';
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
  UPDATE_CATEGORY_TOTALS} from '../utils/constants';
import { Http, modifyMonth } from '../utils';
const http = new Http();


export function getSpendingItems(monthYear: { month: number, year: number }) {
  const { month, year } = monthYear;
  const monthYearStr = `${year}-${modifyMonth(month)}`;
  const currentDate: string = `${monthYearStr}-01`;

  const lastDayDate: Date = new Date(year, +modifyMonth(month), 0);

  const dateInfo: ISpendingDate = {
    start_date: currentDate,
    end_date: `${monthYearStr}-${lastDayDate.getDate()}`
  }
  return http.post(GET_ITEMS_API, GET_SPENDING_ITEMS, dateInfo);
}

export function postSpendingItem(itemInfo: ISpendingItem) {
  return http.post(ITEM_API, POST_SPENDING_ITEM, itemInfo); 
}

export function deleteSpendingItem(item_uuid: string) {
  return http.delete(ITEM_API, DELETE_ITEM, { item_uuid }); 
}

export function getCategories() {
  return http.get(GET_CATEGORIES_API, GET_CATEGORIES);
}

export function postNewCategory(cat_name: string) {
  const data = {
    cat_name,
    cat_budget: 0
  };
  return http.post(GET_CATEGORY_API, POST_CATEGORY, data); 
}

export function deleteCategory(cat_uuid: string) {
  return http.delete(GET_CATEGORY_API, DELETE_CATEGORY, { cat_uuid }); 
}

export function getUserInfo() {
  return http.get(GET_USER_API, GET_USER);
}

/**
 * There's probably a better way this could be written
 */
export function updateCategoriesTotal(spendingData: any) {
  let updatedState: any = [];
  (typeof (spendingData) !== "undefined") && spendingData.map((item: any) => {
    let nothingAdded = 0;
    updatedState.map((category: [number, number], index: number) => {
      if (category[0] === item.cat_id) {
        const newPrice = category[1] + item.item_price;
        updatedState.splice(index, 1, [item.cat_id, newPrice]);
      } else {
        nothingAdded +=1;
      }
    });
    if (updatedState.length === 0 || nothingAdded === updatedState.length) {
      updatedState.push([item.cat_id, item.item_price]);
    };    
  });

  return {
    type: UPDATE_CATEGORY_TOTALS,
    payload: updatedState
  }
}
