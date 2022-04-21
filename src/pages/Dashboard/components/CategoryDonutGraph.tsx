import { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// - services
import { roundNumber, categoryColours } from '@services/index';
import { Spending, Categories } from '@services/Graphql';
import CategoryTotals from '@services/CategoryTotals';
const calculateCategoryTotals = CategoryTotals.main;

// - styles
import DashboardCss from '@assets/styles/views/Dashboard.module.css';

type CategoryDonutGraphProps = {
  items: Spending[] | undefined;
  categories: Categories[] | undefined;
  currency: string | undefined;
};

class CategoryDonutGraph {
  static #graphOptions = {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    hover: {
      mode: 'x',
    },
    maintainAspectRatio: true,
    cutoutPercentage: 65,
    responsive: false,
  } as ChartOptions;

  static main(props: CategoryDonutGraphProps) {
    return (
      <section>
        <Doughnut
          height={500}
          width={400}
          data={CategoryDonutGraph.#graphData(props.categories, props.items)}
          options={CategoryDonutGraph.#graphOptions}
        />
        <h2 className={DashboardCss['Spending-total']}>
          {props.currency}
          {CategoryDonutGraph.#calculateSpendingTotal(props.items)}
        </h2>
      </section>
    );
  }

  /**
   * Generates data for the Doughnut graph
   */
  static #graphData(categories: Categories[] | undefined, items: Spending[] | undefined) {
    const graph_labels: string[] = [];
    const graph_totals: number[] = [];
    const categoryTotals = calculateCategoryTotals(items);

    categoryTotals.map((catTotal) => {
      const nameFromUuid = categories?.filter((category) => category.cat_uuid === catTotal.cat_uuid)[0].cat_name;

      graph_labels.push(nameFromUuid as string);
      graph_totals.push(catTotal.cat_total);
    });

    return {
      labels: graph_labels,
      datasets: [
        {
          data: graph_totals,
          backgroundColor: categoryColours(),
          borderColor: '#f8f8f8',
        },
      ],
    };
  }

  static #calculateSpendingTotal(data: Spending[] | undefined): number {
    let total = 0;

    typeof data !== 'undefined' &&
      data.map((item: Spending) => {
        total += item.item_price;
      });
    return roundNumber(total);
  }
}

export default CategoryDonutGraph.main;
