import { useQuery, useMutation } from 'urql';

class GraphQL {
  static getCategories() {
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

    const [result] = useQuery({
      query,
    });

    debugger
    return result;
  }
}

export default GraphQL;
