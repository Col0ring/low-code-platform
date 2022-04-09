import React from 'react'
import { BrowserRouter, matchPath, useRoutes } from 'react-router-dom'
import { routes } from './routes'

export const AppRouter: React.FC = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

export const AppRoutes: React.FC = () => {
  return <>{useRoutes(routes)}</>
}

export function getActiveKey(
  tabs: { path: string; match?: string; key: string }[],
  pathname: string
) {
  return (
    tabs.find(({ match, path }) =>
      matchPath(
        {
          path: match || path,
        },
        pathname
      )
    )?.key || ''
  )
}
