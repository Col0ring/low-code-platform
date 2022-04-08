import React from 'react'
import { RouteObject, Outlet, Navigate } from 'react-router-dom'
import { Role } from '@/features/auth/constants'
import AuthRoute from './auth-route'
import LazyRoute from './lazy-route'
import ForbiddenPage from './pages/403'
import NotFoundPage from './pages/404'
import LoginPage from '@/features/auth/pages/login'
import AuthLayout from '@/features/auth/layouts/auth-layout'
import AppPageLayout from '@/features/app/layouts/app-page-layout'
import RegisterPage from '@/features/auth/pages/register'
import DesignLayout from '@/features/design/layouts/design-layout'
import ForgetPasswordPage from '@/features/auth/pages/forget-password'
import { Path } from './constants'
import AppLayout from '@/features/app/layouts/app-layout'
import MainLayout from '@/features/main/layouts/main-layout'
import AppSettingLayout from '@/features/app/layouts/app-setting-layout'
import PageIndexPage from '@/features/app/pages/page-index'

export const accessRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <LazyRoute
            component={React.lazy(
              () => import('@/features/main/pages/dashboard')
            )}
          />
        ),
      },
      {
        path: 'app-center',
        element: (
          <LazyRoute
            component={React.lazy(
              () => import('@/features/main/pages/app-center')
            )}
          />
        ),
      },
      {
        path: 'templates-center',
        element: (
          <LazyRoute
            component={React.lazy(
              () => import('@/features/main/pages/templates-center')
            )}
          />
        ),
      },
    ],
  },
  {
    path: 'app/:appId/design/:pageId',
    element: <DesignLayout />,
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
            path: 'setting',
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
    path: 'app/:appId',
    element: <AppLayout />,
    children: [
      {
        path: 'page',
        element: <AppPageLayout />,
        children: [
          {
            index: true,
            element: <PageIndexPage />,
          },
          {
            path: ':pageId',
            element: (
              <LazyRoute
                component={React.lazy(
                  () => import('@/features/app/pages/page-detail')
                )}
              />
            ),
          },
        ],
      },
      {
        path: 'setting',
        element: <AppSettingLayout />,
        children: [
          {
            path: 'basic',
            element: (
              <LazyRoute
                component={React.lazy(
                  () => import('@/features/app/pages/basic-setting')
                )}
              />
            ),
          },
        ],
      },
      {
        path: 'publish',
      },
    ],
  },
]

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={Path.Dashboard} replace />,
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
    element: (
      <AuthRoute
        element={<Outlet />}
        needAuth
        loadingFullScreen
        roles={Role.User}
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
