import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../components/Layout";
import { bindActionCreators, Dispatch } from "redux";
import { Navigate } from 'react-router';

import { getUserInfo,} from "../actions/DashboardActions";
import { updateUserCurency } from "../actions/SettingsActions";
import { isObjEmpty } from "../utils";

import { IReducers, IAction } from "../utils/interfaces";

// Styles
import SettingsCss from "@assets/styles/views/Settings.module.css";
import Inputs from "@assets/styles/components/Inputs.module.css";
import HelpersCss from "@assets/styles/helpers.module.css";
import Buttons from "@assets/styles/components/Buttons.module.css";

class Settings extends Component<any, {}> {

  state = {
    user_currency: '',
    response_code: 0
  }

  async componentDidMount() {
    if (isObjEmpty(this.props.user_info)) await this.props.getUserInfo();
    this.setState({ user_currency: this.props.user_info.user_currency})
  }

  static currencyDropdown(): JSX.Element[] {
    const currencies: Array<{ symbol: string, name: string }> = [
      {
        symbol: '£',
        name: 'Pounds'
      },
      {
        symbol: `€`,
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
        name: 'Yen / Renminbi'
      },
      {
        symbol: '₴',
        name: 'Ukrainian Hryvnia'
      },
      {
        symbol: '₽',
        name: 'Russian Ruble'
      }
    ];

    return currencies.map(currency => (
      <option value={currency.symbol} key={currency.name}>
        {currency.symbol} - {currency.name}
      </option>
    ));
  }

  submitChanges = async (e: any) => {
    e.preventDefault();
    await this.props.updateUserCurency(this.state.user_currency, this.props.user_info);
    this.setState({ response_code: this.props.settings.code});
  }

  changeCurrency = (e: any) => {
    this.setState({...this.state, user_currency: e.target.value});
  }

  render() {
    return (
      <Layout>
        <header style={{ 'marginTop': '4rem', 'textAlign': 'center' }}>
          <h2>Settings</h2>
        </header>
        <form className={SettingsCss.container} onSubmit={this.submitChanges}>
          <div className={HelpersCss['mb-1rem']}>
            <h3>Currency symbol:</h3>
            Choose a currency symbol for your expenses. There's no currency conversion in this app.
          </div>
          <select value={this.state.user_currency} name="currencyDropdown" onChange={this.changeCurrency} className={Inputs['input-spending-form']}>
            {Settings.currencyDropdown()}
          </select>
          <div className={SettingsCss['button-cotainer']}>
            <button className={Buttons['primary-btn']} type="submit">Save changes</button>
            {this.state.response_code === 200 && <Navigate to="/dashboard" />}
          </div>
        </form>
      </Layout>
    )
  }
}

function mapStateToProps(state: IReducers) {
  return { user_info: state.dashboard.user_info, settings: state.settings };
}

function mapDispatchToProps(dispatch: Dispatch<IAction>) {
  return bindActionCreators({ getUserInfo, updateUserCurency }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);