import React, { useState } from 'react';

import Graphql, { Spending, Category } from '@services/Graphql';
import { roundNumber, categoryColours } from '@services/index';
import CategoryTotals from '@services/CategoryTotals';

// - styles
import DashboardCss from '@assets/styles/views/Dashboard.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';
import GlobalCss from '@assets/styles/global.module.css';

// - images
import deleteIcon from '@assets/img/delete-icon.svg';

type CategoriesListProps = {
  items: Spending[] | undefined;
  categories: Category[] | undefined;
  currency: string | undefined;
};

type SetStateFn = React.Dispatch<React.SetStateAction<string>>;

type RenderCategoriesListInput = {
  props: CategoriesListProps;
  filteredCategoryId: string;
  setFiteredCategoryId: SetStateFn;
};

const MAX_CATEGORIES = 10;

class CategoriesList {
  static main(props: CategoriesListProps) {
    const [filteredCategoryId, setFiteredCategoryId] = useState('');
    const [newCategory, setNewCategory] = useState('');

    return (
      <>
        <div className={DashboardCss['cat-container']}>
          {CategoriesList.#addNewCategoriesForm(newCategory, setNewCategory)}
          {CategoriesList.#renderCategoriesList({ props, filteredCategoryId, setFiteredCategoryId })}
        </div>
      </>
    );
  }

  static #addNewCategoriesForm(newCategory: string, setNewCategory: SetStateFn) {
    return (
      <form className={HelpersCss['dis-f']} onSubmit={(e) => CategoriesList.#handleAddCategory(e, newCategory)}>
        <input
          type="text"
          name="new_category"
          className={DashboardCss['cat-form__input']}
          placeholder="e.g. Chocolate fund"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <button className={DashboardCss['cat-form__submit']}>Add category</button>
      </form>
    );
  }

  static async #handleAddCategory(e: React.FormEvent<HTMLFormElement>, newCategory: string) {
    try {
      e.preventDefault();
      const result = await Graphql.addCategory(newCategory);

      const categories = Graphql.getCategories();

      if (categories.data.length === MAX_CATEGORIES) {
        throw new Error('You have reached the maximum number of categories');
      }

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  static #renderCategoriesList(args: RenderCategoriesListInput) {
    const { props, filteredCategoryId, setFiteredCategoryId } = args;

    return props.categories?.map((cat: Category, index: number) => {
      const calculateCategoryTotals = CategoryTotals.main;
      const categoryTotals = calculateCategoryTotals(props.items);
      const categoryFiltered = filteredCategoryId === cat.cat_uuid;
      const categoryTotal = categoryTotals.find((categoryTotal) => categoryTotal.cat_uuid === cat.cat_uuid)?.cat_total;

      return (
        <section key={cat.cat_uuid} className={DashboardCss['cat-row']}>
          <div className={DashboardCss['cat-color-circle']} style={{ backgroundColor: categoryColours()[index] }} />
          <section className={DashboardCss['cat-row__text']}>
            <div
              className={categoryFiltered ? DashboardCss['cat-row__name'] : HelpersCss['cur-p']}
              onClick={() => setFiteredCategoryId(cat.cat_uuid)}
            >
              {cat.cat_name}
            </div>
            <div className={DashboardCss['cat-row__price']}>
              {props.currency}
              {roundNumber(categoryTotal || 0)}
            </div>
            <img
              src={deleteIcon}
              className={GlobalCss['delete-icon']}
              alt="Delete Icon"
              onClick={() => CategoriesList.#deleteCategory(cat.cat_uuid)}
            />
          </section>
        </section>
      );
    });
  }

  static async #deleteCategory(cat_uuid: string) {
    try {
      const result = await Graphql.deleteCategory(cat_uuid);

      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      console.error(error);
    }
  }
}

export default CategoriesList.main;
