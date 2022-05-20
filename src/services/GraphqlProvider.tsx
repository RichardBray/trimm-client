import React, { useContext } from 'react';
import { createClient, Provider, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange, SystemFields } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';

import { GlobalStore } from '@services/GlobalStore';
import Api, {Spending} from '@services/Api';

const API_URL = import.meta.env.VITE_API_URL as string;

export type ReactChildren = {
  children: React.ReactNode;
};

type GraphqlData = SystemFields & {items: Spending[]}

function GraphqlProvider({ children }: ReactChildren) {
  try {
  const globalStore = useContext(GlobalStore);
  const accessToken = sessionStorage.getItem('accessToken') || globalStore?.state.accessToken;

  const client = createClient({
    url: `${API_URL}/graphql`,
    fetchOptions: {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    },
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
      fetchExchange,
    ],
  });

  return <Provider value={client}>{children}</Provider>;
} catch(error) {
  console.error(`GraphqlProvider: ${error}`);
}
}

export default GraphqlProvider;
