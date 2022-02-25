import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter, AppRoutes } from './router'
import AppProvider from './provider'
import '@/styles/index.less'
import 'virtual:windi.css'

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
