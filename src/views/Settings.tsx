import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../components/Layout";
import { bindActionCreators, Dispatch } from "redux";

import { getUserInfo,} from "../actions/DashboardActions";
import { updateUserCurency } from "../actions/SettingsActions";
import { isEmpty } from "../utils";

import { IReducers, IAction } from "../utils/interfaces";

// Styles
import SettingsCss from "~/assets/styles/views/Settings";
import Inputs from "~/assets/styles/components/Inputs";
import HelpersCss from "~/assets/styles/helpers";

class Settings extends Component<any, {}> {

  state = {
    user_currency: ''
  }

  async componentDidMount() {
    if (isEmpty(this.props.user_info)) await this.props.getUserInfo();
    this.setState({ user_currency: this.props.user_info.user_currency})
  }

  static currencyDropdown(): JSX.Element[] {
    const currencies: Array<{ symbol: string, name: string }> = [
      {
        symbol: '£',
        name: 'Pounds'
      },
      {
        symbol: '€',
        name: 'Euros'
      },
      {
        symbol: '$',
        name: 'Dollars'
      },
      {
        symbol: 'Kr.',
        name: 'Danish Krona'
      },
      {
        symbol: 'CHf',
        name: 'Swiss Franc'
      },
      {
        symbol: '¥',
        name: 'Yen'
      }
    ];

    return currencies.map(currency => (
      <option value={currency.symbol} key={currency.name}>
        {currency.symbol} - {currency.name}
      </option>
    ));
  }

  submitChanges = (e: any) => {
    e.preventDefault()
    this.props.updateUserCurency(this.state.user_currency, this.props.user_info)
  }

  changeCurrency = (e: any) => {
    this.setState({...this.state, user_currency: e.target.value})
  }

  render() {
    return (
      <Layout>
        <header style={{ 'marginTop': '4rem', 'textAlign': 'center' }}>
          <h2>Settings</h2>
        </header>
        <form className={SettingsCss.container} onSubmit={this.submitChanges}>
          <div>
            <h3>Curreny symbol:</h3>
            Choose a currency symbol for your expenses. There's no currency conversion in this app.
          </div>
          <select value={this.state.user_currency} name="" onChange={this.changeCurrency} className={Inputs['input-spending-form']}>
            {Settings.currencyDropdown()}
          </select>
          <button type="submit">Save changes</button>
        </form>
      </Layout>
    )
  }
}

function mapStateToProps(state: IReducers) {
  return { user_info: state.dashboard.user_info };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getUserInfo, updateUserCurency }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);