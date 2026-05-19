import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import LandingPage from './features/auth/pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ChangePasswordPage from './features/auth/pages/ChangePasswordPage';
import Sidebar from './features/auth/pages/Sidebar';
import VoterRegistrationForm from './features/voter/pages/VoterRegistrationForm';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import PostDetailsPage from './features/admin/pages/PostDetailsPage';
import PostMappingPage from './features/admin/pages/PostMappingPage';
import RoleCreationPage from './features/admin/pages/RoleCreationPage';
import UserDetailsPage from './features/admin/pages/UserDetailsPage';
import setupAxiosInterceptors from './lib/interceptors/axios-interceptor';
import { ConfigProvider, theme } from 'antd';
import './styles/index.css';

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
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/change-password',
    element: <ChangePasswordPage />,
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
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'voter-registration',
        element: <VoterRegistrationForm />,
      },
      {
        path: 'post-details',
        element: <PostDetailsPage />,
      },
      {
        path: 'post-person-mapping',
        element: <PostMappingPage />,
      },
      {
        path: 'roles',
        element: <RoleCreationPage />,
      },
      {
        path: 'users',
        element: <UserDetailsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={{ 
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#8b5cf6',
          borderRadius: 12,
        }
      }}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
