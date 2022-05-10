import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import GraphqlProvider from '@services/GraphqlProvider';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register';
import RedirectPage from './pages/RedirectPage';
import Settings from './pages/Settings';
import '@assets/styles/global.module.css';

const SENTRY_ID = import.meta.env.VITE_SENTRY_ID as string;
const ENV = import.meta.env.MODE as string;

const ROOT = document.querySelector('.react-root');
const root = ReactDOM.createRoot(ROOT as Element);

if (ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_ID,
  });
}

root.render(
  <GraphqlProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  </GraphqlProvider>
);
