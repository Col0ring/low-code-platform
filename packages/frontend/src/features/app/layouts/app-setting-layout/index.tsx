import MenuLayout, { menuLayoutProps } from '@/components/menu-layout'
import { Path } from '@/router/constants'
import React from 'react'
import { Outlet } from 'react-router'

const menus: menuLayoutProps['menus'] = [
  {
    title: '基础设置',
    key: Path.AppBasicSetting(':appId'),
    path: Path.AppBasicSetting(':appId'),
  },
  {
    title: '权限设置',
    key: Path.AppAuthSetting(':appId'),
    path: Path.AppAuthSetting(':appId'),
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
