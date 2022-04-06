import MenuLayout, { menuLayoutProps } from '@/components/menu-layout'
import { Path } from '@/router/constants'
import React from 'react'
import { Outlet } from 'react-router'

const menus: menuLayoutProps['menus'] = [
  {
    title: '基础设置',
    key: Path.AppBasicSetting('1'),
    path: Path.AppBasicSetting('1'),
  },
  {
    title: '权限设置',
    key: Path.AppAuthSetting('1'),
    path: Path.AppAuthSetting('1'),
  },
]

const AppSettingLayout: React.FC = () => {
  return (
    <MenuLayout menus={menus}>
      <Outlet />
    </MenuLayout>
  )
}

export default AppSettingLayout
