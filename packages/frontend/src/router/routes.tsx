import React from 'react'
import { RouteObject } from 'react-router-dom'
import EditPage from '@/pages/edit'
import { AuthRoute } from './auth-route'
import { LazyRoute } from './lazy-route'

export const accessRoutes: RouteObject[] = []

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <EditPage />,
  },
  {
    path: '/auth',
    element: (
      <AuthRoute
        render={() => (
          <LazyRoute render={() => import('@/pages/edit')} loadingFullScreen />
        )}
        roles={['user']}
      />
    ),
    children: accessRoutes,
  },
]
