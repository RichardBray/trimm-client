import React, {Component} from "react";
import { IServerResponses } from "../uitls/interfaces";


class SpendingItems extends Component<any, {}> {

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

  private _renderItems(data: any) {
    if (typeof (data) !== "undefined") {
      return data.map((item: any) => (
        <section key={item.item_uuid} id={item.item_uuid}>
          <div>
            {item.cat_name}
            {item.item_name}
          </div>
          <div>
            {item.create_dttm}
            {item.item_price}
          </div>
        </section>)
      );
    }
  }   
}

export default SpendingItems;