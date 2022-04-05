import { getActiveKey } from '@/router'
import { Layout, Menu, Space } from 'antd'
import React, { useMemo } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

export interface menuLayoutProps {
  menus: {
    key: string
    path: string
    icon?: React.ReactNode
    title: React.ReactNode
  }[]
}

const MenuLayout: React.FC<menuLayoutProps> = ({ menus, children }) => {
  const { pathname } = useLocation()
  const activeKey = useMemo(
    () => getActiveKey(menus, pathname),
    [menus, pathname]
  )
  return (
    <Layout>
      <Layout.Sider>
        <Menu activeKey={activeKey}>
          {menus.map((menu) => {
            return (
              <Menu.Item key={menu.key}>
                <Link to={menu.path}>
                  <Space>
                    {menu.icon}
                    {menu.title}
                  </Space>
                </Link>
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
