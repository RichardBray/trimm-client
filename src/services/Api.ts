import { useQuery, useMutation, OperationContext, OperationResult } from 'urql';
import Rest from '@services/Rest';

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

export type UpdateMutationFn = (
  variables?: unknown,
  context?: Partial<OperationContext>
) => Promise<OperationResult<unknown, unknown>>

export type LoginInput = {
  username: string;
  password: string;
};

export type ItemsDateRange = {
  startDate: string,
  endDate: string,
}

class Api {
  static getItemsQuery = `#graphql
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

  static async login(loginData: LoginInput) {
    const usernameExists = loginData.hasOwnProperty('username') || loginData.username;
    const passwordExists = loginData.hasOwnProperty('password') || loginData.password;

    if (!usernameExists) throw new Error(`username not found`);
    if (!passwordExists) throw new Error(`password not found`);

    return await Rest.post('/login', {
      body: JSON.stringify(loginData),
    });
  }

  static getDashboardData({startDate, endDate}: ItemsDateRange) {
    const query = `#graphql
      query ($startDate: String!, $endDate: String!) {
        items(startDate: $startDate, endDate: $endDate) {
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
      variables: {startDate, endDate},
    });

    return result;
  }

  static getAllItems({startDate, endDate}: ItemsDateRange) {
    const query = `#graphql
      query ($startDate: String!, $endDate: String!) {
        items(startDate: $startDate, endDate: $endDate) {
          item_uuid
          item_name
          item_price
          create_dttm
          cat_uuid
        }
      }
    `;

    const [result] = useQuery({
      query,
      variables: {startDate, endDate},
    });

    return result;
  }

  static createItem() {
    const query = `#graphql
      mutation ($itemCreateInput: ItemCreateInput!) {
        createItem(itemCreateInput: $itemCreateInput) {
          item_uuid
          item_name
          item_price
          create_dttm
          cat_uuid
        }
      }
    `;

    return useMutation(query);
  }

  static deleteItem() {
    const query = `#graphql
      mutation ($itemUuid: String!) {
        deleteItem(item_uuid: $itemUuid) {
          item_uuid
        }
      }
    `;

    return useMutation(query);
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

    return useMutation(query);
  }

  static deleteCategory(catUuid: string) {
    const query = `#graphql
      mutation($catUuid: String!) {
        deleteCategory(cat_uuid: $catName) {
          cat_uuid
        }
      }
    `;

    return useMutation(query);
  }
}

export default Api;
