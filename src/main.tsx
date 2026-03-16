import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './config/store';
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Sidebar from './pages/auth/Sidebar';
import VoterRegistrationForm from './pages/voter-pages/VoterRegistrationForm';
import setupAxiosInterceptors from './config/axios-interceptor';
import './index.css';

// Initialize Axios Interceptors with a dummy callback
setupAxiosInterceptors(() => {
  console.log('User unauthenticated');
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/voter-registration',
    element: <VoterRegistrationForm />,
  },
  {
    path: '/dashboard',
    element: <Sidebar />,
    children: [
      {
        path: 'voter-registration',
        element: <VoterRegistrationForm />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
