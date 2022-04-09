import MenuLayout, { MenuLayoutProps } from '@/components/menu-layout'
import { App } from '@/features/main/type'
import { Path } from '@/router/constants'
import React, { useMemo } from 'react'
import { Outlet, useOutletContext } from 'react-router'

const AppSettingLayout: React.FC = () => {
  const app = useOutletContext<App>()
  const menus = useMemo<MenuLayoutProps['menus']>(
    () => [
      {
        title: '基础设置',
        key: Path.AppBasicSetting(app.id),
        path: Path.AppBasicSetting(app.id),
      },
      {
        title: '权限设置',
        key: Path.AppAuthSetting(app.id),
        path: Path.AppAuthSetting(app.id),
      },
    ],
    [app.id]
  )
  return (
    <MenuLayout menus={menus}>
      <Outlet context={app} />
    </MenuLayout>
  )
}

export default AppSettingLayout
