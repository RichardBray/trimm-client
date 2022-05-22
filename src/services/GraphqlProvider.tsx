import React, { useContext } from 'react';
import { createClient, Provider, dedupExchange, fetchExchange, errorExchange } from 'urql';
import { cacheExchange, SystemFields } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';
import { Navigate } from "react-router-dom";

import { GlobalStore } from '@services/GlobalStore';
import Api, { Spending } from '@services/Api';

const API_URL = import.meta.env.VITE_API_URL as string;

export type ReactChildren = {
  children: React.ReactNode;
};

type GraphqlData = SystemFields & { items: Spending[] };

function GraphqlProvider({ children }: ReactChildren): JSX.Element | null {
  try {
    const globalStore = useContext(GlobalStore);
    const accessToken = sessionStorage.getItem('accessToken') ?? globalStore?.state.accessToken;
    const addJWTTokenToRequests = {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    };

    const client = createClient({
      url: `${API_URL}/graphql`,
      fetchOptions: addJWTTokenToRequests,
      exchanges: [
        devtoolsExchange,
        dedupExchange,
        cacheExchange({
          updates: {
            Mutation: {
              createItem: (result, _args, cache) => {
                cache.updateQuery({ query: Api.getItemsQuery }, (data: GraphqlData | null) => {
                  if (!data) throw new Error('Grapql data not found');

                  return {
                    ...data,
                    items: [...data.items, result.createItem],
                  } as GraphqlData;
                });
              },
            },
          },
        }),
        errorExchange({
          onError: (error) => {
            const isSessionTimeoutError = error.message.includes('JsonWebTokenError');
            if (isSessionTimeoutError) {
              return <Navigate to="/session-error" />
            }

            return <Navigate to="/server-error" />
          }
        }),
        fetchExchange,
      ],
    });

    return <Provider value={client}>{children}</Provider> ?? null;
  } catch (error) {
    console.error(`GraphqlProvider: ${error}`);
    return null;
  }
}

export default GraphqlProvider;
