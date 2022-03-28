import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { createClient, Provider, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { authExchange } from '@urql/exchange-auth';

import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Register from './views/Register';
import RedirectPage from './views/RedirectPage';
import Settings from './views/Settings';
import { gaInit } from './utils';
import '@assets/styles/global.module.css';

const API_URL = import.meta.env.VITE_API_URL as string;
const SENTRY_ID = import.meta.env.VITE_SENTRY_ID as string;
const ENV = import.meta.env.VITE_ENV as string;

const ROOT = document.querySelector('.react-root');
const client = createClient({
  url: `${API_URL}/graphql`,
  exchanges: [dedupExchange, cacheExchange({}), authExchange(), fetchExchange],
});

if (ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_ID,
  });
  gaInit();
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
