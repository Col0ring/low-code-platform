import React from 'react'
import { RouteObject } from 'react-router-dom'
import { Spin } from 'antd'
import LazyLoad from '@/components/lazy-load'

function renderLazyPage(
  factory: () => Promise<{
    default: React.FC<{}>
  }>,
  loadingFullScreen = true
) {
  return (
    <LazyLoad
      fallback={
        <Spin
          spinning
          style={{
            width: '100%',
            height: loadingFullScreen ? '100vh' : '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      }
    >
      {React.createElement(React.lazy(factory))}
    </LazyLoad>
  )
}

export const staticRoutes: RouteObject[] = [
  {
    path: '/',
    element: renderLazyPage(() => import('@/pages/edit')),
  },
]

export const accessRoutes: RouteObject[] = []
