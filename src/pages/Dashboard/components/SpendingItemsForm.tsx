import React, { ChangeEvent, FormEvent, useState } from 'react';

import Api, { Category, CreateItemInput, UpdateMutationFn }  from '@services/Api';
// - styles
import Inputs from '@assets/styles/components/Inputs.module.css';
import Buttons from '@assets/styles/components/Buttons.module.css';
import DashboardCss from '@assets/styles/views/Dashboard.module.css';
import HelpersCss from '@assets/styles/helpers.module.css';


type SpendingItemsFormProps = {
  categoriesData: Category[] | undefined;
};

type SpendingItemsFormState = {
  spending_item: {
    cat_id: string;
    create_dttm: string;
    item_name: string;
    item_price: string;
  };
};

type StateOutput = [SpendingItemsFormState, React.Dispatch<React.SetStateAction<SpendingItemsFormState>>];

type CreateSpendingItemInput = {
  formEvent: FormEvent<HTMLFormElement>;
  stateData: StateOutput;
  createItem: UpdateMutationFn;
};

class SpendingItemsForm {
  static #defaultState: SpendingItemsFormState = {
    spending_item: {
      cat_id: '',
      create_dttm: '',
      item_name: '',
      item_price: '',
    },
  };

  static main(props: SpendingItemsFormProps) {
    const stateData = useState(SpendingItemsForm.#defaultState);
    const [state] = stateData;
    const { item_name, create_dttm, item_price } = state.spending_item;
    const [_updateResults, createItem] = Api.createItem();

    const categoryList = props.categoriesData?.map((cat: Category) => (
      <option key={cat.cat_uuid} value={cat.cat_uuid}>
        {cat.cat_name}
      </option>
    ));

    return (
      <form
        className={DashboardCss['spending-form']}
        onSubmit={(e) =>
          SpendingItemsForm.#createSpendingItem({ formEvent: e, stateData, createItem: createItem as UpdateMutationFn })
        }
      >
        <section className={`${HelpersCss['w-70']} dis-f`}>
          <div className={DashboardCss['spending-form__text']}>
            <label htmlFor="cat_id" className={DashboardCss['spending-form__text_box']}>
              Category:
            </label>
            <label htmlFor="item_name" className={DashboardCss['spending-form__text_box']}>
              Description:
            </label>
            <label htmlFor="create_dttm" className={DashboardCss['spending-form__text_box']}>
              Date:
            </label>
          </div>
          <div className={DashboardCss['spending-form__inputs']}>
            <select
              name="cat_id"
              value={state.spending_item.cat_id}
              className={Inputs['input-spending-form']}
              onChange={(e) => SpendingItemsForm.#handleChange(e, stateData)}
              required
            >
              <option value="0" disabled>
                --
              </option>
              {categoryList}
            </select>
            <input
              type="text"
              name="item_name"
              placeholder="Description"
              className={Inputs['input-spending-form']}
              value={item_name}
              onChange={(e) => SpendingItemsForm.#handleChange(e, stateData)}
              required
            />
            <input
              type="date"
              name="create_dttm"
              placeholder="Date"
              className={Inputs['input-spending-form']}
              onChange={(e) => SpendingItemsForm.#handleChange(e, stateData)}
              value={create_dttm}
              autoComplete="off"
              data-form-type="other"
            />
          </div>
        </section>
        <section className={HelpersCss['w-30']}>
          <input
            type="number"
            name="item_price"
            placeholder="Price"
            className={Inputs['input-spending-form-price']}
            value={item_price}
            onChange={(e) => SpendingItemsForm.#handleChange(e, stateData)}
            required
          />
          <button type="submit" className={Buttons['primary-btn']}>
            Add Item
          </button>
        </section>
      </form>
    );
  }

  static #handleChange(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, stateData: StateOutput) {
    const [state, updateState] = stateData;
    const updatedState: SpendingItemsFormState = {
      spending_item: {
        ...state.spending_item,
        [e.target?.name]: e.target?.value,
      },
    };
    updateState(updatedState);
  }

  static async #createSpendingItem(options: CreateSpendingItemInput) {
    const { formEvent, stateData, createItem } = options;
    const [state] = stateData;

    formEvent.preventDefault();

    try {
      const itemCreateInput: CreateItemInput = {
        name: state.spending_item.item_name,
        price: Number(state.spending_item.item_price),
        catUuid: state.spending_item.cat_id,
        createDttm: new Date(state.spending_item.create_dttm),
      };

      const res = await createItem({ itemCreateInput });

      if (res.error) {
        throw new Error(res.error.message);
      }
    } catch (error) {
      console.error(`createSpendingItem: ${error}`);
    }
  }
}

export default SpendingItemsForm.main;
