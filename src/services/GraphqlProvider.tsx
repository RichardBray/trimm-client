import React from 'react';
import { createClient, Provider, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';

const API_URL = import.meta.env.VITE_API_URL as string;

export type ReactChildren = {
    children: React.ReactNode;
  };

function GraphqlProvider({ children }: ReactChildren) {

  const client = createClient({
    url: `${API_URL}/graphql`,
    fetchOptions: {
      headers: {
        Authorization: `bearer ${sessionStorage.getItem('accessToken')}`,
      },
    },
    exchanges: [devtoolsExchange, dedupExchange, cacheExchange({}), fetchExchange],
  });

  return <Provider value={client}>{children}</Provider>;
}

export default GraphqlProvider;
