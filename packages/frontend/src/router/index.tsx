import AppShowView from '@/features/app/pages/app-show-view'
import React from 'react'
import {
  BrowserRouter,
  matchPath,
  Route,
  Routes,
  useRoutes,
} from 'react-router-dom'
import { routes } from './routes'

export const AppRouter: React.FC = ({ children }) => {
  return (
    <>
      {window.appViewId ? (
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<AppShowView />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <BrowserRouter>{children}</BrowserRouter>
      )}
    </>
  )
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
