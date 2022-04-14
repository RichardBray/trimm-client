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
      Authorization: `bearer eyJraWQiOiJuak04cjhkVFl1bHowTWxYTmFcL0paaXFVaVwvVU1EUXN1SjNaV3hxNGV1VzQ9IiwiYWxnIjoiUlMyNTYifQ.eyJvcmlnaW5fanRpIjoiYThjYjEyYzItZWJiNC00MzBjLWIxN2MtZWZlNWMzM2QxMjcwIiwic3ViIjoiZWQ4ZmU0NmItOGZjZC00MTQ3LThmY2QtNzI0OGUwMWM2NGM3IiwiZXZlbnRfaWQiOiJjZmIwZTMwMi04ODVhLTQ2MWYtOGEwZi0xZWQ2YWQ5N2I5OWYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjQ5OTQzNjM5LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9ydWNwOU50SGoiLCJleHAiOjE2NDk5NDcyMzksImlhdCI6MTY0OTk0MzYzOSwianRpIjoiYzYwZTQ0NTAtNGUzMC00MjBiLWFiNTYtNDdmNGFlN2M5MWE0IiwiY2xpZW50X2lkIjoiM28wYm10MjByaXIydXU5dWF1bDM2cjloamkiLCJ1c2VybmFtZSI6ImVkOGZlNDZiLThmY2QtNDE0Ny04ZmNkLTcyNDhlMDFjNjRjNyJ9.Hdh3UrrOwYpkEQhiHCltbb09ppgltq7H28UGOF5Qo-fBqw04_BQBAvg5xs9UYHP0lxi7niGAdtd1SOKN0Wj2h1cTk7sUSIDKUtQokEMWJmI9cDcdaUguU2962Tcz-waIbKhNT5Q2KtL5fweqbFUAVO9XKvBepfbir8lS3y1JLTUQ_siDit3tOnCC9AiUpzOLZDYnyqXHZj8hK-aXPW9kAWgvLGRGA7UvObDDO7bkWYb1dmNKXLzVDQd-UuYbARGXIdN7OoH-6qJZAKQWzO3a5h62xh5GWyDdX8X0enVyKytXDsFarNRcaxSxaOPsbaTNCT_vzKdOz0roM-WtNwkefA`,
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
