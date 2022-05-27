import React, { createContext, useReducer } from 'react';
import * as Helpers from '@services/index';

export enum DispatchActionTypes {
  addAccessToken,
  addDateRange,
  addCategoryFilterId,
}

export type ReactChildren = {
  children: React.ReactNode;
};

export type GlobalStoreState = {
  accessToken: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  categoryFilterId: number;
};

export type Dispatch = (action: GlobalStoreAction) => void;

export type GlobalStoreOutput = {
  state: GlobalStoreState,
  dispatch: Dispatch,
}

type GlobalStoreAction = {
  type: DispatchActionTypes;
  payload: string | Record<string, unknown>;
};

const initialState: GlobalStoreState = {
  accessToken: '',
  dateRange: {
    startDate: Helpers.initialDateValues().startDate,
    endDate: Helpers.initialDateValues().endDate,
  },
  categoryFilterId: 0,
};

export const GlobalStore = createContext<GlobalStoreOutput | undefined>(undefined);

function reducer(state: GlobalStoreState, action: GlobalStoreAction): GlobalStoreState {
  switch (action.type) {
    case DispatchActionTypes.addAccessToken:
      return { ...state, accessToken: action.payload as string };
    case DispatchActionTypes.addDateRange:
      return {
        ...state,
        dateRange: action.payload as {
          startDate: string;
          endDate: string;
        },
      };
    default:
      return state;
  }
}

export function GlobalStoreProvider({ children }: ReactChildren): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <GlobalStore.Provider value={{ state, dispatch }}>{children}</GlobalStore.Provider>;
}
