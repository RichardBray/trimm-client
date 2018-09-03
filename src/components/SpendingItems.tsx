import React, {Component} from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { monthToText } from "../uitls";
import { deleteSpendingItem, getSpendingItems, updateCategoriesTotal } from "../actions/DashboardActions";
import { IServerResponses, IAction } from "../uitls/interfaces";

// Styles
import SpendingItemCss from "~/assets/styles/components/SpendingItems";
import HelpersCss from "~/assets/styles/helpers";
import GlobalCss from "~/assets/styles/global";

// Images
import deleteIcon from "~/assets/img/delete-icon.svg";


class SpendingItems extends Component<any, {}> {

  renderItems(data: any): JSX.Element {
    return (typeof (data) !== "undefined") && data.map((item: any) => {
      return (
        <section key={item.item_uuid} className={SpendingItemCss.container}>
          <div className={SpendingItemCss['first-column']}>
            <div className={SpendingItemCss['cat-title']}>{item.cat_name}</div>
            <div>{item.item_name}</div>
          </div>
          <div className={SpendingItemCss['second-column']}>
            <div className={HelpersCss['mb-1rem']}>{this._formatDate(item.create_dttm)}</div>
            <div className={SpendingItemCss['price-text']}>{this.props.currency}{item.item_price}</div>
          </div>
          <div className={SpendingItemCss['third-column']}>
            <img 
              src={deleteIcon}
              alt="Delete Icon"
              className={GlobalCss['delete-icon']}
              onClick={() => this._deleteItem(item.item_uuid)} />
          </div>          
        </section>
      );
    }
    );
  };

  render(): JSX.Element[] | JSX.Element {
    const { data, code } = this.props;
    const render_no_items = <div className={SpendingItemCss['no-items']}>You have no items 😢</div>;
    const responses: IServerResponses = {
      200: this.renderItems(data),
      404: render_no_items,
      401: <div>Looks like you are somewhere you shouldn't be.</div>
    }
    return responses[code];
  };

  private _formatDate(date: string): string {
    const splitTime = date.split(" ");
    const splitDates = splitTime[0].split("-");
    const year = splitDates[0];
    const month = monthToText(splitDates[1]);
    const day = splitDates[2];

    return `${day} ${month} ${year}`;
  }

  /**
   * Editing will come later
   */
  private async _deleteItem(item_uuid: string): Promise<void> {
    await this.props.deleteSpendingItem(item_uuid);
    await this.props.getSpendingItems(this.props.dateRange);
    await this.props.updateCategoriesTotal(this.props.data);     
  }  
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ deleteSpendingItem, getSpendingItems, updateCategoriesTotal }, dispatch);
}

export default connect(null, mapDispatchToProps)(SpendingItems);
