import React, {Component} from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { deleteSpendingItem, getSpendingItems, updateCategoriesTotal } from "../actions/DashboardActions";
import { IServerResponses, IAction } from "../uitls/interfaces";


class SpendingItems extends Component<any, {}> {

  renderItems(data: any): JSX.Element {
    return (typeof (data) !== "undefined") && data.map((item: any) => {
      return (
        <section key={item.item_uuid}>
          <div>
            {item.cat_name}
            {item.item_name}
          </div>
          <div>
            {item.create_dttm}
            {item.item_price}
          </div>
          <div>
            <a href="#" onClick={() => this._deleteItem(item.item_uuid)}>delete</a>
          </div>
        </section>
      );
    }
    );
  };

  render(): JSX.Element[] | JSX.Element {
    const { data, code } = this.props;
    const render_no_items = <div>You have no items</div>;
    const responses: IServerResponses = {
      200: this.renderItems(data),
      404: render_no_items,
      401: <div>Looks like you are somewhere you shouldn't be.</div>
    }
    return responses[code];
  };

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
