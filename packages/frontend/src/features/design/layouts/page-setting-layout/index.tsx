import MenuLayout, { MenuLayoutProps } from '@/components/menu-layout'
import { Page } from '@/features/app/type'
import { App } from '@/features/main/type'
import { Path } from '@/router/constants'
import React, { useMemo } from 'react'
import { Outlet, useOutletContext } from 'react-router'

const PageSettingLayout: React.FC = () => {
  const page = useOutletContext<
    Page & {
      app: App
    }
  >()
  const menus = useMemo<MenuLayoutProps['menus']>(
    () => [
      {
        title: '基础设置',
        key: Path.DesignBasicSetting(page.app.id, page.id),
        path: Path.DesignBasicSetting(page.app.id, page.id),
      },
      {
        title: '权限设置',
        key: Path.DesignAuthSetting(page.app.id, page.id),
        path: Path.DesignAuthSetting(page.app.id, page.id),
      },
    ],
    [page.app.id, page.id]
  )
  return (
    <MenuLayout menus={menus}>
      <Outlet context={page} />
    </MenuLayout>
  )
}

export default PageSettingLayout
