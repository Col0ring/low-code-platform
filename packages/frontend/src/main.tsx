import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter, AppRoutes } from './router'
import './index.less'

ReactDOM.render(
  <React.StrictMode>
    <AppRouter>
      <AppRoutes />
    </AppRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
