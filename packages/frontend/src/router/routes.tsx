import React from 'react'
import { RouteObject } from 'react-router-dom'
import EditPage from '@/pages/edit'
import { Role } from '@/store'
import EditorPage from '@/pages/editor'
import AuthRoute from './auth-route'
import LazyRoute from './lazy-route'
import ForbiddenPage from '@/pages/403'
import NotFoundPage from '@/pages/404'

export const accessRoutes: RouteObject[] = []

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <EditorPage />,
  },
  {
    path: '/login',
    element: (
      <AuthRoute
        element={<EditPage />}
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
        path: '/public/',
        element: <ForbiddenPage />,
      },
      {
        // path: '*',
        index: true,
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
        element={<EditPage />}
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
        element={
          <LazyRoute
            component={React.lazy(() => import('@/pages/edit'))}
            loadingFullScreen
          />
        }
        roles={[Role.Admin]}
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
