import React, { useContext } from 'react';
import { createClient, Provider, dedupExchange, fetchExchange, errorExchange } from 'urql';
import { Cache, cacheExchange, DataFields, SystemFields } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';
import { useNavigate } from 'react-router-dom';

import { GlobalStore } from '@services/GlobalStore';
import Api, { Spending } from '@services/Api';

const API_URL = import.meta.env.VITE_API_URL as string;

export type ReactChildren = {
  children: React.ReactNode;
};

type UpdateItemsInCacheInput = {
  result: DataFields;
  cache: Cache;
  queryName: string;
};

type GraphqlData = SystemFields & { items: Spending[] };

function GraphqlProvider({ children }: ReactChildren): JSX.Element | null {
  try {
    const globalStore = useContext(GlobalStore);
    const navigate = useNavigate();
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
              createItem: (result, _args, cache) =>
                updateItemsInCache({
                  result,
                  cache,
                  queryName: 'createItem',
                }),
              deleteItem: (result, _args, cache) =>
                updateItemsInCache({
                  result,
                  cache,
                  queryName: 'deleteItem',
                }),
            },
          },
        }),
        errorExchange({
          onError: (error) => {
            const isSessionTimeoutError = error.message.includes('jwt expired');
            if (isSessionTimeoutError) {
              navigate('/session-error');
              return;
            }

            navigate('/server-error');
          },
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

function updateItemsInCache(args: UpdateItemsInCacheInput) {
  args.cache.updateQuery({ query: Api.getItemsQuery }, (data: GraphqlData | null) => {
    if (!data) throw new Error('Grapql data not found');

    return {
      ...data,
      items: [...data.items, args.result[args.queryName]],
    } as GraphqlData;
  });
}

export default GraphqlProvider;
