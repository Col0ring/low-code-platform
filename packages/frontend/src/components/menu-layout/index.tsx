import { getActiveKey } from '@/router'
import { Layout, Menu, Space } from 'antd'
import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

export interface MenuLayoutItemProps {
  key: string
  path: string
  icon?: React.ReactNode
  title: React.ReactNode
  [x: PropertyKey]: any
}

export interface MenuLayoutProps {
  extra?: React.ReactNode
  menus: MenuLayoutItemProps[]
  render?: (node: React.ReactNode, menu: MenuLayoutItemProps) => React.ReactNode
}

const MenuLayout: React.FC<MenuLayoutProps> = ({
  menus,
  extra,
  children,
  render,
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeKey = useMemo(
    () => getActiveKey(menus, pathname),
    [menus, pathname]
  )
  return (
    <Layout className="h-full">
      <Layout.Sider className="bg-white w-300px py-3">
        {extra}
        <Menu selectedKeys={[activeKey]}>
          {menus.map((menu) => {
            return (
              <Menu.Item key={menu.key} onClick={() => navigate(menu.path)}>
                {render ? (
                  render(
                    <Space>
                      {menu.icon}
                      {menu.title}
                    </Space>,
                    menu
                  )
                ) : (
                  <Space>
                    {menu.icon}
                    {menu.title}
                  </Space>
                )}
              </Menu.Item>
            )
          })}
        </Menu>
      </Layout.Sider>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  )
}

export default MenuLayout
