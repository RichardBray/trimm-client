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

const client = createClient({
  url: `${API_URL}/graphql`,
  fetchOptions: {
    headers: {
      Authorization: `bearer eyJraWQiOiJuak04cjhkVFl1bHowTWxYTmFcL0paaXFVaVwvVU1EUXN1SjNaV3hxNGV1VzQ9IiwiYWxnIjoiUlMyNTYifQ.eyJvcmlnaW5fanRpIjoiZjk3MzU3ODAtYTBlNS00ZDhmLThlOTEtYWU5MmE1MTA0MDY1Iiwic3ViIjoiZWQ4ZmU0NmItOGZjZC00MTQ3LThmY2QtNzI0OGUwMWM2NGM3IiwiZXZlbnRfaWQiOiI3NTZhNWJkNi1hOWQyLTQ4NTEtYjViYi0xMzU0YTIxOTQ5OTkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjQ5Nzc2NzExLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9ydWNwOU50SGoiLCJleHAiOjE2NDk3ODAzMTEsImlhdCI6MTY0OTc3NjcxMSwianRpIjoiYTFlN2NmNWMtYjU1ZS00ZDUyLTk1YzAtMTMyNTUwYTFlMjFmIiwiY2xpZW50X2lkIjoiM28wYm10MjByaXIydXU5dWF1bDM2cjloamkiLCJ1c2VybmFtZSI6ImVkOGZlNDZiLThmY2QtNDE0Ny04ZmNkLTcyNDhlMDFjNjRjNyJ9.TSDHLQg4MlbM-sLN-C6CbCJfLJcnbzCqRxq6jiHs1fdW2O_M-WW4nKJ5dpj107y_QD8D3NH2UpN8j4garZSfIqzodpHgtZlG_gf2IV3wX0ZmFAR_MoLo-ldKjBwLRSwL_xiHLvdfBumb-ELij-upLAWNPe6HFqBIpxYUDA9vgP_-2q0Sz1cQU8pQCWBevycq20Zbbcr-ynVpbTvJoxMrve7sKRgD768OErGNY9V3X5rKiqQXnGxKO-ndgqqjR6zXxZtK-nuuQNv_PKb74WNam2qElNGxK6PkX3EJTYfV8N2Nqoe0YnX4NL05YeIolfGIaHwUeQvSfb-3WNopbXkB-g`,
    }
  },
  exchanges: [devtoolsExchange, dedupExchange, cacheExchange({}), fetchExchange],
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
