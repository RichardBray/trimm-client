import React, { useContext } from 'react';
import { createClient, Provider, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';

import { GlobalStore } from '@services/GlobalStore';
import Api from '@services/Api';

const API_URL = import.meta.env.VITE_API_URL as string;

export type ReactChildren = {
    children: React.ReactNode;
  };

function GraphqlProvider({ children }: ReactChildren) {

  const globalStore = useContext(GlobalStore);
  const accessToken = sessionStorage.getItem('accessToken') || globalStore?.state.accessToken;

  const client = createClient({
    url: `${API_URL}/graphql`,
    fetchOptions: {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    },
    exchanges: [devtoolsExchange, dedupExchange, cacheExchange({
      updates: {
        Mutation: {
          createItem: (result, _args, cache) => {
            cache.updateQuery({query: Api.getItemsQuery}, data => ({
              ...data,
              items: [...data?.items, result?.items],
            }));
          }
        }
      }
    }), fetchExchange],
  });

  return <Provider value={client}>{children}</Provider>;
}


export default GraphqlProvider;
