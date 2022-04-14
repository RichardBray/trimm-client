import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { createClient, Provider, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register';
import RedirectPage from './pages/RedirectPage';
import Settings from './pages/Settings';
import '@assets/styles/global.module.css';

const API_URL = import.meta.env.VITE_API_URL as string;
const SENTRY_ID = import.meta.env.VITE_SENTRY_ID as string;
const ENV = import.meta.env.VITE_ENV as string;

const ROOT = document.querySelector('.react-root');

console.log(sessionStorage.getItem('accessToken'), 'sdf')
const client = createClient({
  url: `${API_URL}/graphql`,
  fetchOptions: {
    headers: {
      Authorization: `bearer ${sessionStorage.getItem('accessToken')}`,
    }
  },
  exchanges: [devtoolsExchange, dedupExchange, cacheExchange({}), fetchExchange],
});

if (ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_ID,
  });
}

ReactDOM.render(
  <Provider value={client}>
    <BrowserRouter>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  ROOT
);
