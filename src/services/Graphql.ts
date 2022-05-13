import { useQuery, useMutation, OperationContext, OperationResult  } from 'urql';

export type Category = {
  id?: string;
  cat_uuid: string;
  cat_name: string;
  user_uuid?: string;
};

export type Spending = {
  id?: string;
  item_uuid: string;
  item_name: string;
  item_price: number;
  create_dttm: Date;
  cat_uuid: string;
  user_uuid: string;
};

export type User = {
  id?: string;
  user_uuid: string;
  user_name: string;
  user_email: string;
  user_currency: string;
};

export type CreateItemInput = {
  name: string;
  price: number;
  createDttm: Date;
  catUuid: string;
};

export type UpdateMutationFn = (variables?: unknown, context?: Partial<OperationContext>) => Promise<OperationResult<unknown, unknown>>;

class Graphql {
  static getDashboardData() {
    const query = `#graphql
      query {
        items(startDate: "2022-03-01", endDate: "2022-04-01") {
          item_uuid
          item_name
          item_price
          create_dttm
          cat_uuid
        }
        categories {
          cat_uuid
          cat_name
        }
        getUser {
          user_currency
        }
      }
  `;

    const [result] = useQuery({
      query,
    });

    return result;
  }

  static refreshSpendingAllItems() {
    const query = `#graphql
      query {
        items(startDate: "2022-03-01", endDate: "2022-04-01") {
          item_uuid
          item_name
          item_price
          create_dttm
          cat_uuid
        }
      }
  `;

    return useQuery({
      query,
    });
    reexecuteQuery({ requestPolicy: 'network-only' });
  }

  static createItem() {
    const query = `#graphql
      mutation ($itemCreateInput: ItemCreateInput!) {
        createItem(itemCreateInput: $itemCreateInput) {
          item_name
          item_uuid
        }
      }
    `;

    return useMutation(query);

    // return Graphql.#executeMutation(query, { itemCreateInput });
  }

  static deleteItem(itemUuid: string) {
    const query = `#graphql
      mutation ($itemUuid: String!) {
        deleteItem(item_uuid: $itemUuid) {
          item_uuid
        }
      }
    `;

    return Graphql.#executeMutation(query, { itemUuid });
  }

  static getCategories() {
    const query = `#graphql
      query {
        categories {
          cat_uuid
          cat_name
        }
      }
    `;

    const [result] = useQuery({
      query,
    });

    return result;
  }

  static addCategory(catName: string) {
    const query = `#graphql
      mutation($catName: String!) {
        createCategory(cat_name: $catName) {
          cat_uuid
        }
      }
    `;

    return Graphql.#executeMutation(query, { catName });
  }

  static deleteCategory(catUuid: string) {
    const query = `#graphql
      mutation($catUuid: String!) {
        deleteCategory(cat_uuid: $catName) {
          cat_uuid
        }
      }
    `;

    return Graphql.#executeMutation(query, { catUuid });
  }

  static #executeMutation(query: string, mutationIdenfifier: Record<string, string> | Record<string, CreateItemInput>) {
    const [_updateResults, updateFn] = useMutation(query);

    return updateFn(mutationIdenfifier);
  }
}

export default Graphql;
