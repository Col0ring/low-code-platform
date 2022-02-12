import React from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from './routes'

export const AppRouter: React.FC = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

export const AppRoutes: React.FC = () => {
  return <>{useRoutes(routes)}</>
}
