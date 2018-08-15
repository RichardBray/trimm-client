import React, {Component} from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { deleteSpendingItem } from "../actions/DashboardActions";
import { IServerResponses, IAction } from "../uitls/interfaces";


class SpendingItems extends Component<any, {}> {

  /**
   * Editing will come later
   */
  deleteItem(item_uuid: string): any {
    this.props.deleteSpendingItem(item_uuid);
  }

  render(): JSX.Element[] | JSX.Element {
    const { data, code } = this.props;
    const render_no_items = <div>You have no items</div>;
    const responses: IServerResponses = {
      200: this._renderItems(data),
      404: render_no_items,
      401: <div>Looks like you are somewhere you shouldn't be.</div>
    }
    return responses[code];
  }

  private _renderItems(data: any): JSX.Element {
    if (typeof (data) !== "undefined") {
      return data.map((item: any) => (
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
            <a href="#" onClick={() => this.deleteItem(item.item_uuid)}>delete</a>
          </div>
        </section>)
      );
    }
  }   
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ deleteSpendingItem }, dispatch);
}

export default connect(null, mapDispatchToProps)(SpendingItems);