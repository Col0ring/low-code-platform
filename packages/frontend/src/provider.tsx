import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { Provider as ReduxProvider } from 'react-redux'
import moment from 'moment'
import 'moment/locale/zh-cn'
import store from '@/store'

moment.locale('zh-cn')

const AppProvider: React.FC = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
    </ReduxProvider>
  )
}

export default AppProvider
