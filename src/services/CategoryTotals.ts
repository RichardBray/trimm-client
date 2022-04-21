import { Spending } from '@services/Graphql';

type CategoryTotalsOutput = {
  cat_uuid: string;
  cat_total: number;
};

class CategoryTotals {
  static main(items: Spending[] | undefined): CategoryTotalsOutput[] {

    if (!items || items.length === 0) {
      console.error('CategoryTotals.main: items is undefined');
      return [];
    }

    const uniquUuids = CategoryTotals.#getUniqueCategoryUuids(items);

    return CategoryTotals.#addTotalsToUuids(uniquUuids, items);
  }

  static #getUniqueCategoryUuids(items: Spending[]) {
    let categoryUuids: string[] = [];

    items.forEach((item) => {
      if (categoryUuids.includes(item.cat_uuid)) {
        return;
      }
      categoryUuids.push(item.cat_uuid);
    });

    return categoryUuids;
  }

  static #addTotalsToUuids(uniquUuids: string[], items: Spending[]): CategoryTotalsOutput[] {
    let categoriesWithTotals: CategoryTotalsOutput[] = [];

    uniquUuids.forEach((uniqeUuid) => {
      const itemsWithCatUuid = items.filter((item) => item.cat_uuid === uniqeUuid);
      const catTotal = itemsWithCatUuid.reduce((previous, current) => previous + current.item_price, 0);

      categoriesWithTotals.push({
        cat_uuid: uniqeUuid,
        cat_total: catTotal,
      });
    });

    return categoriesWithTotals;
  }
}

export default CategoryTotals;
