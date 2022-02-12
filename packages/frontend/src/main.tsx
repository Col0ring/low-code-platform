import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter, AppRoutes } from './router'
import AppProvider from './provider'
import './index.less'

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <AppRouter>
        <AppRoutes />
      </AppRouter>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
