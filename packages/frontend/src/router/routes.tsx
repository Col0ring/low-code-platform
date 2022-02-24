import React from 'react'
import { RouteObject } from 'react-router-dom'
import EditPage from '@/features/editor/pages/edit'
import { Role } from '@/features/auth/constants'
import AuthRoute from './auth-route'
import LazyRoute from './lazy-route'
import ForbiddenPage from './pages/403'
import NotFoundPage from './pages/404'
import LoginPage from '@/features/auth/pages/login'

export const accessRoutes: RouteObject[] = []

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <EditPage />,
  },
  {
    path: '/login',
    element: (
      <AuthRoute
        element={<LoginPage />}
        loadingFullScreen
        needAuth={false}
        notLogin
      />
    ),
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
            component={React.lazy(() => import('@/features/editor/pages/edit'))}
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
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
