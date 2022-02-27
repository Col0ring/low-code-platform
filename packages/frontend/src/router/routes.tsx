import React from 'react'
import { RouteObject } from 'react-router-dom'
import EditPage from '@/features/design/pages/page-designer'
import { Role } from '@/features/auth/constants'
import AuthRoute from './auth-route'
import LazyRoute from './lazy-route'
import ForbiddenPage from './pages/403'
import NotFoundPage from './pages/404'
import LoginPage from '@/features/auth/pages/login'
import AuthLayout from '@/features/auth/layouts/auth-layout'
import RegisterPage from '@/features/auth/pages/register'
import DesignLayout from '@/features/design/layouts/design-layout'
import ForgetPasswordPage from '@/features/auth/pages/forget-password'
import { Path } from './constants'

export const accessRoutes: RouteObject[] = []

export const routes: RouteObject[] = [
  {
    path: '/design',
    element: <DesignLayout />,
    children: [
      {
        path: 'page-designer',
        element: (
          <LazyRoute
            component={React.lazy(
              () => import('@/features/design/pages/page-designer')
            )}
          />
        ),
      },
    ],
  },
  {
    element: (
      <AuthRoute
        element={<AuthLayout />}
        loadingFullScreen
        needAuth={false}
        notLogin
      />
    ),
    children: [
      {
        path: Path.Login,
        element: <LoginPage />,
      },
      {
        path: Path.Register,
        element: <RegisterPage />,
      },
      {
        path: Path.ForgetPassword,
        element: <ForgetPasswordPage />,
      },
    ],
  },
  {
    path: '/public',
    element: (
      <AuthRoute loading={false} element={<EditPage />} needAuth={false} />
    ),
    children: [
      // index 代表和父 path 相同的 path
      {
        path: '',
        element: <ForbiddenPage />,
      },
      {
        // path: '*',
        // index: true,
        element: <NotFoundPage />,
      },

      {
        element: <EditPage />,
        children: [
          {
            path: '2',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <AuthRoute
        element={
          <LazyRoute
            component={React.lazy(
              () => import('@/features/design/pages/page-designer')
            )}
          />
        }
        needAuth
        loadingFullScreen
        roles={[Role.User]}
      />
    ),
    children: accessRoutes,
  },
  {
    path: '/auth',
    element: (
      <AuthRoute
        needAuth
        loadingFullScreen
        element={<EditPage />}
        roles={[Role.User]}
      />
    ),
    children: accessRoutes,
  },
  {
    path: Path.Forbidden,
    element: <ForbiddenPage />,
  },
  {
    path: Path.NotFound,
    element: <NotFoundPage />,
  },
]
