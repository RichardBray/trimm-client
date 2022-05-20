import React, { createContext, useReducer } from 'react';

export enum DispatchActionTypes {
  addAccessToken,
}

export type ReactChildren = {
  children: React.ReactNode;
};

export type GlobalStoreState = {
  accessToken: string;
};

export type Dispatch = (action: GlobalStoreAction) => void;

type GlobalStoreAction = {
  type: DispatchActionTypes;
  payload: string;
};

const initialState: GlobalStoreState = {
  accessToken: '',
};

export const GlobalStore = createContext<{ state: GlobalStoreState; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: GlobalStoreState, action: GlobalStoreAction): GlobalStoreState {
  switch (action.type) {
    case DispatchActionTypes.addAccessToken:
      return { ...state, accessToken: action.payload };
    default:
      return state;
  }
}

export function GlobalStoreProvider({ children }: ReactChildren): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <GlobalStore.Provider value={{ state, dispatch }}>{children}</GlobalStore.Provider>;
}
