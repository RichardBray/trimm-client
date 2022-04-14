import { useQuery } from 'urql';


 export type categories = {
  id?: string
  cat_uuid: string
  cat_name: string
  user_uuid?: string
}

export type spending = {
  id?: string
  item_uuid: string
  item_name: string
  item_price: number
  create_dttm: Date
  cat_uuid: string
  user_uuid: string
}

export type users = {
  id?: string
  user_uuid: string
  user_name: string
  user_email: string
  user_currency: string
}

class Graphql {
  static getDashboardData = `#graphql
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
  }
`;

  static getCategories() {
    const query = Graphql.getDashboardData;

    const [result] = useQuery({
      query,
    });

    return result;
  }
}

export default Graphql;
