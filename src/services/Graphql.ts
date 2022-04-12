import { useQuery } from 'urql';

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

    const [result, reexecuteQuery] = useQuery({
      query,
    });

    return result;
  }
}

export default Graphql;
