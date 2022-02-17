import React from 'react'
import { RouteObject } from 'react-router-dom'
import EditPage from '@/pages/edit'
import { Role } from '@/store'
import EditorPage from '@/pages/editor'
import AuthRoute from './auth-route'
import LazyRoute from './lazy-route'

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
    children: accessRoutes,
  },
  {
    path: '/dashboard',
    element: (
      <AuthRoute
        element={<EditPage />}
        needAuth
        loadingFullScreen
        roles={[Role.Admin]}
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
]
