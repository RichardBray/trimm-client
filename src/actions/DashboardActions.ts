/* global fetch */
import { Dispatch } from 'redux';
import { IAction, ISpendingDate, ISpendingItem } from '../uitls/interfaces';
import { GET_CATEGORIES_API, GET_CATEGORIES, GET_SPENDING_ITEMS, GET_ITEMS_API, GET_USER_API, GET_USER, ITEM_API, POST_SPENDING_ITEM } from '../uitls/constants';
import { getHeader, postHeader } from '../uitls';


export function getSepdningItems(monthYear: { month: number, year: number }) {
  const { month, year } = monthYear;
  const currentDate: string = `${year}-${_modifyMonth(month)}-01`;

  const newDate: Date = _oneMonthToDate(currentDate);
  const newMonth = _modifyMonth(newDate.getMonth() + 1)

  const dateInfo: ISpendingDate = {
    start_date: currentDate,
    end_date: `${newDate.getFullYear()}-${newMonth}-01`
  }

  return (dispatch: Dispatch<IAction>) =>
    fetch(GET_ITEMS_API, postHeader(dateInfo))
      .then(response => response.json())
      .then(payload => {
        dispatch({type: GET_SPENDING_ITEMS, payload})
      });
}

export function postSpendingItem(itemInfo: ISpendingItem) {
  return (dispatch: Dispatch<IAction>) =>
    fetch(ITEM_API, postHeader(itemInfo))
      .then(response => response.json())
      .then(payload => {
        dispatch({ type: POST_SPENDING_ITEM, payload })
      });  
}

export function getCategories() {
  return (dispatch: Dispatch<IAction>) =>
    fetch(GET_CATEGORIES_API, getHeader())
      .then(response => response.json())
      .then(payload => {
        dispatch({ type: GET_CATEGORIES, payload })
      });  
}

export function getUserInfo() {
  return (dispatch: Dispatch<IAction>) =>
    fetch(GET_USER_API, getHeader())
      .then(response => response.json())
      .then(payload => {
        dispatch({ type: GET_USER, payload })
      });   
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