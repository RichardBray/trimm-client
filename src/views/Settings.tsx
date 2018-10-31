import React from "react";
import Layout from "../components/Layout";

// Styles
import SettingsCss from "~/assets/styles/views/Settings";
import Inputs from "~/assets/styles/components/Inputs";

function Settings() {
  return (
    <Layout>
      <header style={{ 'marginTop': '4rem', 'textAlign': 'center' }}>
        <h2>Settings</h2>
      </header>
      <section className={SettingsCss.container}>
        <div>
          <h3>Curreny symbol:</h3>
          Choose a currency symbol for your expenses, there's no currency conversion in this app so
        </div>
        <select name="" className={Inputs['input-spending-form']}>
          {currencyDropdown()}
        </select>
      </section>
    </Layout>
  )
}

function currencyDropdown() {
  const currencies = [
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
    }
  ];

  return currencies.map( currency => (
    <option value={currency.symbol} key={currency.name}>
      {currency.symbol} - {currency.name}
    </option>
  ));
}

export default Settings;