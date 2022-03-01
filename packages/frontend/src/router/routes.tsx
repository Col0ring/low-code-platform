import React from 'react'
import { RouteObject } from 'react-router-dom'
import EditPage from '@/features/design/pages/design-index'
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

export const accessRoutes: RouteObject[] = []

export const routes: RouteObject[] = [
  {
    path: '/design',
    element: (
      <AuthRoute
        element={<DesignLayout />}
        needAuth
        loadingFullScreen
        roles={Role.User}
      />
    ),
    children: [
      {
        index: true,
        element: (
          <LazyRoute
            component={React.lazy(
              () => import('@/features/design/pages/design-index')
            )}
          />
        ),
      },
      {
        element: <DesignLayout />,
        children: [
          {
            path: '/design/setting',
            element: (
              <LazyRoute
                component={React.lazy(
                  () => import('@/features/design/pages/design-index')
                )}
              />
            ),
          },
        ],
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
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forget-password',
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
              () => import('@/features/design/pages/design-index')
            )}
          />
        }
        needAuth
        loadingFullScreen
        roles={Role.User}
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
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
