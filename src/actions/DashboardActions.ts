/* global fetch */
import {  ISpendingDate, ISpendingItem } from '../uitls/interfaces';
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
  UPDATE_CATEGORY_TOTALS} from '../uitls/constants';
import { getHeader, postHeader, deleteHeader, fetchFunc } from '../uitls';


export function getSpendingItems(monthYear: { month: number, year: number }) {
  const { month, year } = monthYear;
  const currentDate: string = `${year}-${_modifyMonth(month)}-01`;

  const newDate: Date = _oneMonthToDate(currentDate);
  const newMonth = _modifyMonth(newDate.getMonth() + 1)

  const dateInfo: ISpendingDate = {
    start_date: currentDate,
    end_date: `${newDate.getFullYear()}-${newMonth}-01`
  }

  return fetchFunc(GET_ITEMS_API, GET_SPENDING_ITEMS, postHeader, dateInfo); 
}

export function postSpendingItem(itemInfo: ISpendingItem) {
  return fetchFunc(ITEM_API, POST_SPENDING_ITEM, postHeader, itemInfo); 
}

export function deleteSpendingItem(item_uuid: string) {
  const itemInfo = { item_uuid };
  return fetchFunc(ITEM_API, DELETE_ITEM, deleteHeader, itemInfo);
}

export function getCategories() {
  return fetchFunc(GET_CATEGORIES_API, GET_CATEGORIES, getHeader);
}

export function postNewCategory(cat_name: string) {
  const data = {
    cat_name,
    cat_budget: 0
  };
  return fetchFunc(GET_CATEGORY_API, POST_CATEGORY, postHeader, data);  
}

export function deleteCategory(cat_uuid: string) {
  return fetchFunc(GET_CATEGORY_API, DELETE_CATEGORY, deleteHeader, {cat_uuid});
}

export function getUserInfo() {
  return fetchFunc(GET_USER_API, GET_USER, getHeader);
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

/**
 * Adds one month to the date passed into it
 */
function _oneMonthToDate(currentDate: string): Date {
  const newDate: Date = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

/**
 * Adds `0` to month if it has single number
 * @example _modifyMonth(8) // 08
 * @example _modifyMonth(11) // 11
 */
function _modifyMonth(month: number): string {
  return (`0${month}`).slice(-2);
}